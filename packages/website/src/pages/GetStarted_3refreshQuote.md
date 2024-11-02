
Our application works fine, but we force the user to refresh the page to see a new quote. Let's add a button to refresh the quote.

## Insert a button

Let's start by replacing the `src/Main.tsx` file content with the following:

```tsx
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
		<>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</>
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
			<button key="refresh-button" type='button'>Refresh</button>
			{ /* NB: and also here!! */ }
			<Quote key="quote" quote={quote} />
		</>
	);

	// Create an async iterator to wait for the button click
	const events = component.waitEvents(
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
			this.renderSync(
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
The `Main` component renders a button and the Quote component tagging them with `key` attribute: SeqFlow tracks it internally, so it knows:
- which component to replace when the quote is fetched;
- the button to wait for the click event;

After, the `Main` component waits for the button click event and replaces the Quote component with the new quote.

Anyway, we can improve the above code avoiding duplicated code. Let's see how.

## Create a Spot component

Let's start by replacing the `src/Main.tsx` file content with the following:

```tsx
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
		<>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</>
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
			<button key="refresh-button" type='button'>Refresh</button>
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

In the above code, we created a new component called `Spot`. It is an empty component and it is used to tag the place where the `Quote` component will be rendered. We use the `key` attribute to track it.

## Avoid double fetch

The above code has a subtle bug: if the user clicks the button twice before the first fetch is completed, the application will fetch the quote twice. Let's fix it using the below code:

```tsx
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
		<>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</>
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

	component.renderSync(
		<>
			<button key="refresh-button" type='button'>Refresh</button>
			<Spot key="quote" />
		</>
	);

	await fetchAndRender();

	const refreshButton = component.getChild('refresh-button') as HTMLButtonElement;
	const events = component.waitEvents(
		component.domEvent('refresh-button', 'click')
	)
	for await (const _ of events) {
		// Disable the button while fetching the quote
		refreshButton.disabled = true;
		await fetchAndRender();
		// Enable the button after fetching the quote
		refreshButton.disabled = false;
	}
}
```

You can refer to child elements using the `getChild` method. This is useful when you need to access the real HTML element and change its properties. Anyway, Typescript doesn't understand which real element is. This is why we have to cast the button to `HTMLButtonElement`. With this cast, we can use the `disabled` attribute to disable the button while the quote is being fetched.

## Conclusion

In this tutorial, we have learned how to handle the click events and how to avoid double fetches. We also learned how to use the `key` attribute to track the components. Now, we have a fully functional application that shows a random quote and allows the user to refresh it by clicking a button!

:::next:::
{"label": "Learn how to configure the application", "next": "/get-started/configuration"}
:::end-next:::
