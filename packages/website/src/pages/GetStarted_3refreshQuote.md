
Our application works fine, but we force the user to refresh the page to see a new quote. Let's add a button to refresh the quote.

## Insert a button

Our goal now is to add a button that, when clicked, will refresh the quote.
We will use the `component.replaceChild` method that allows us to replace only a portion of the component.

Let's start by replacing the `src/Main.tsx` file content with the following:

```tsx
import { Button, Prose } from "@seqflow/components";
import { Contexts } from "@seqflow/seqflow";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://quotes.seqflow.dev/api/quotes/random")
	return await res.json();
}


// This is the new component: it receives a quote and renders it
function Quote({ quote }: { quote: Quote }, { component }: Contexts) {
	component.renderSync(
		<Prose>
			<p>{quote.content}</p>
			<p>{quote.author}</p>
		</Prose>
	);
}
// The loading component
function Loading({}, { component }: Contexts) {
	component.renderSync(
		<p>Loading...</p>
	);
}
// The error component
function ErrorMessage(data: { error: unknown }, { component }: Contexts) {
	if (data.error instanceof Error) {
		component.renderSync(
			<p>{data.error.message}</p>
		);
	} else {
		component.renderSync(
			<p>Unknown error</p>
		);
	}
}

export async function Main({}, { component }: Contexts) {
	component.renderSync(
		<Loading />
	);

	let quote: Quote;
	try {
		quote = await getRandomQuote();
	} catch (error) {
		component.renderSync(
			<ErrorMessage error={error} />
		);
		return;
	}

	component.renderSync(
		<>
			{ /* NB: we added the key attribute here!! */ }
			<Button key="refresh-button" type='button'>Refresh</Button>
			{ /* NB: and also here!! */ }
			<Quote key="quote" quote={quote} />
		</>
	);

	// Create an async iterator to wait for the button click
	const events = component.waitEvents(
		// We use the "key" to reference the button
		component.domEvent('refresh-button', 'click')
	)
	// Wait for the button click
	for await (const _ of events) {
		// Refresh the quote
		let quote: Quote;
		try {
			quote = await getRandomQuote();
		} catch (error) {
			// This replace the hole content with the error message
			component.renderSync(
				<ErrorMessage error={error} />
			);
			return;
		}
		// Replace only the child with key "quote" with the new quote
		component.replaceChild("quote", () => <Quote key="quote" quote={quote} />);
	}
}
```

In the above code, we added a button. We use it to wait for a click event and refresh the quote.
The `Main` component renders a button and the Quote component tags them with `key` attribute: SeqFlow tracks it internally, so it knows:
- which component to replace when the quote is fetched;
- the button to wait for the click event;

After, the `Main` component waits for the button click event and replaces the Quote component with the new quote.

Anyway, we can improve the above code by avoiding duplicated code. Let's see how.

## Create a Spot component

The code duplication is not a good practice. We invoke `getRandomQuote` twice: once when the page is loaded and once when the button is clicked.

What we want is to create a function that can be invoked when the component is mounted the first time and when the button is clicked. This function should shows the loading message, fetches the quote, and renders it.

Let's start by replacing the `src/Main.tsx` file content with the following:

```tsx
import { Button, Prose } from "@seqflow/components";
import { Contexts } from "@seqflow/seqflow";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://quotes.seqflow.dev/api/quotes/random")
	if (!res.ok) {
		throw new Error("Failed to fetch quote");
	}
	return await res.json();
}

function Quote({ quote }: { quote: Quote }, { component }: Contexts) {
	component.renderSync(
		<Prose>
			<p>{quote.content}</p>
			<p>{quote.author}</p>
		</Prose>
	);
}
function Loading({}, { component }: Contexts) {
	component.renderSync(
		<p>Loading...</p>
	);
}
function ErrorMessage(data: { error: unknown }, { component }: Contexts) {
	if (data.error instanceof Error) {
		component.renderSync(
			<p>{data.error.message}</p>
		);
	} else {
		component.renderSync(
			<p>Unknown error</p>
		);
	}
}

// New component to keep the place where the quote will be rendered
function Spot() {}

export async function Main({}, { component }: Contexts) {
	// This async arrow function fetches a new quote and renders
	// It use the key \`quote\` to replace the child with the loader or the new quote
	const fetchAndRender = async () => {
		component.replaceChild("quote", () => <Loading key="quote" />);

		let quote: Quote;
		try {
			quote = await getRandomQuote();
		} catch (error) {
			component.replaceChild("quote", () => <ErrorMessage key="quote" error={error} />);
			return;
		}
		component.replaceChild("quote", () => <Quote key="quote" quote={quote} />);
	}

	// Render the structure of the html
	component.renderSync(
		<>
			<Button key="refresh-button" type='button'>Refresh</Button>
			<Spot key="quote" />
		</>
	);

	// Fetch and render the quote
	await fetchAndRender();

	const events = component.waitEvents(
		component.domEvent('refresh-button', 'click')
	)
	for await (const _ of events) {
		// Refresh the quote
		await fetchAndRender();
	}
}
```

In the above code, we created a new component called `Spot`. It is empty and tags the place where the `Quote` component will be rendered. We use the `key` attribute to track it.

## Avoid double fetch

The above code has a subtle bug: if the user clicks the button twice before the first fetch is completed, the application will fetch the quote twice.

Using the component library provided by SeqFlow team, we can avoid this issue. We can disable the button while the quote is being fetched.

Let's fix it using the below code:

```tsx
import { Button, ButtonComponent, Prose } from "@seqflow/components";
import { Contexts } from "@seqflow/seqflow";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://quotes.seqflow.dev/api/quotes/random")
	if (!res.ok) {
		throw new Error("Failed to fetch quote");
	}
	return await res.json();
}

function Quote({ quote }: { quote: Quote }, { component }: Contexts) {
	component.renderSync(
		<Prose>
			<p>{quote.content}</p>
			<p>{quote.author}</p>
		</Prose>
	);
}
function Loading({}, { component }: Contexts) {
	component.renderSync(
		<p>Loading...</p>
	);
}
function ErrorMessage(data: { error: unknown }, { component }: Contexts) {
	if (data.error instanceof Error) {
		component.renderSync(
			<p>{data.error.message}</p>
		);
	} else {
		component.renderSync(
			<p>Unknown error</p>
		);
	}
}

function Spot() {}

export async function Main({}, { component }: Contexts) {
	const fetchAndRender = async () => {
		const refreshButton = component.getChild<ButtonComponent>('refresh-button');

		// Disable the button while fetching the quote
		refreshButton.transition({
			disabled: true,
			loading: true,
			loadingText: 'Fetching...',
		})

		component.replaceChild("quote", () => <Loading key="quote" />);

		let quote: Quote;
		try {
			quote = await getRandomQuote();
		} catch (error) {
			component.replaceChild("quote", () => <ErrorMessage key="quote" error={error} />);
			return;
		}
		component.replaceChild("quote", () => <Quote key="quote" quote={quote} />);

		// Enable the button after fetching the quote
		refreshButton.transition({
			disabled: false,
			loading: false,
		})
	}

	component.renderSync(
		<>
			<Button key="refresh-button" type='button'>Refresh</Button>
			<Spot key="quote" />
		</>
	);

	await fetchAndRender();

	const events = component.waitEvents(
		component.domEvent('refresh-button', 'click')
	)
	for await (const _ of events) {
		await fetchAndRender();
	}
}
```

`ButtonComponent` is a special component that allows you to change the button properties.
It exposts `transition` method that allows you to change the button properties easily. In the above code, we use it to disable the button while the quote is being fetched and show a loading spinner.

When the quote is fetched, we enable the button again.

NB: Typescript doesn't understand what the real element is. This is why we have to cast the button to `ButtonComponent` (which extends `HTMLButtonElement`).

## Conclusion

In this tutorial, we have learned how to handle click events and avoid double fetches. We have also learned how to use the `key` attribute to track the components.

Now, we have a fully functional application that shows a random quote and allows the user to refresh it by clicking a button. Well done!

:::next:::
{"label": "Learn how to configure the application", "next": "/get-started/configuration"}
:::end-next:::
