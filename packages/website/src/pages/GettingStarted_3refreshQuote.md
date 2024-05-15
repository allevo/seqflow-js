
Our application works fine, but we force the user to refresh the page to see a new quote. Let's add a button to refresh the quote.

## Insert a button

Let's start by replacing the `src/Main.tsx` file content with the following:

```tsx
import { SeqflowFunctionContext } from "seqflow-js";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://api.quotable.io/random")
	return await res.json();
}

// This is the new component: it receives a quote and renders it
async function Quote(this: SeqflowFunctionContext, { quote }: { quote: Quote }) {
	this.renderSync(
		<>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</>
	);
}

async function Loading(this: SeqflowFunctionContext) {
	this.renderSync(
		<p>Loading...</p>
	);
}
async function ErrorMessage(this: SeqflowFunctionContext, data: { message: string }) {
	this.renderSync(
		<p>{data.message}</p>
	);
}

export async function Main(this: SeqflowFunctionContext) {
	this.renderSync(
		<Loading />
	);

	let quote: Quote;
	try {
		quote = await getRandomQuote();
	} catch (error) {
		this.renderSync(
			<ErrorMessage message={error.message} />
		);
		return;
	}

	// create an interactive element: the button
	const button = <button type='button'>Refresh</button>
	this.renderSync(
		<>
			{ /* Render it */ }
			{button}
			{ /* NB: we added the key attribute here!! */ }
			<Quote key="quote" quote={quote} />
		</>
	);

	// Create an async iterator to wait for the button click
	const events = this.waitEvents(
		this.domEvent('click', { el: button })
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
				<ErrorMessage message={error.message} />
			);
			return;
		}
		// Replace only the child with key "quote" with the new quote
		this.replaceChild("quote", () => <Quote key="quote" quote={quote} />);
	}
}
```

In the above code, we added a button. We use it to wait for a click event and refresh the quote.
The `Main` component renders the button and the Quote component tagging it with `key` attribute: SeqFlow tracks it internally, so it knows which component to replace when the button is clicked.

After, the `Main` component waits for the button click event and replaces the Quote component with the new quote.

Anyway, we can improve the above code avoiding duplicated code. Let's see how.

## Create a Spot component

Let's start by replacing the `src/Main.tsx` file content with the following:

```tsx
import { SeqflowFunctionContext } from "seqflow-js";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://api.quotable.io/random")
	return await res.json();
}

// This is the new component: it receives a quote and renders it
async function Quote(this: SeqflowFunctionContext, { quote }: { quote: Quote }) {
	this.renderSync(
		<>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</>
	);
}

async function Loading(this: SeqflowFunctionContext) {
	this.renderSync(
		<p>Loading...</p>
	);
}
async function ErrorMessage(this: SeqflowFunctionContext, data: { message: string }) {
	this.renderSync(
		<p>{data.message}</p>
	);
}
async function Spot(this: SeqflowFunctionContext) {}

export async function Main(this: SeqflowFunctionContext) {
	// This async arrow function fetches a new quote and renders
	// It use the key \`quote\` to replace the child with the loader or the new quote
	const fetchAndRender = async () => {
		this.replaceChild("quote", () => <Loading key="quote" />);

		let quote: Quote;
		try {
			quote = await getRandomQuote();
		} catch (error) {
			this.replaceChild("quote", () => <ErrorMessage key="quote" message={error.message} />);
			return;
		}
		this.replaceChild("quote", () => <Quote key="quote" quote={quote} />);
	}

	const button = <button type='button'>Refresh</button>
	// Render the structure of the html
	this.renderSync(
		<>
			{button}
			<Spot key="quote" />
		</>
	);

	// Fetch and render the quote
	await fetchAndRender();

	const events = this.waitEvents(
		this.domEvent('click', { el: button })
	)
	for await (const _ of events) {
		// Refresh the quote
		await fetchAndRender();
	}
}
```

In the above code, we created a new component called `Spot`. It is an empty component and it is used to tag the place where the `Quote` component will be rendered. We use the `key` attribute to track it.

## Avoid double fetch

The above code has a subtle bug: if the user clicks the button twice before the first fetch completes, the application will fetch the quote twice. Let's fix it using the below code:

```tsx
import { SeqflowFunctionContext } from "seqflow-js";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://api.quotable.io/random")
	return await res.json();
}

async function Quote(this: SeqflowFunctionContext, { quote }: { quote: Quote }) {
	this.renderSync(
		<>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</>
	);
}

async function Loading(this: SeqflowFunctionContext) {
	this.renderSync(
		<p>Loading...</p>
	);
}
async function ErrorMessage(this: SeqflowFunctionContext, data: { message: string }) {
	this.renderSync(
		<p>{data.message}</p>
	);
}
async function Spot(this: SeqflowFunctionContext) {}

export async function Main(this: SeqflowFunctionContext) {
	const fetchAndRender = async () => {
		this.replaceChild("quote", () => <Loading key="quote" />);

		let quote: Quote;
		try {
			quote = await getRandomQuote();
		} catch (error) {
			this.replaceChild("quote", () => <ErrorMessage key="quote" message={error.message} />);
			return;
		}
		this.replaceChild("quote", () => <Quote key="quote" quote={quote} />);
	}

	// SeqFlow JSX doesn't know which HTML element is rendered, so we need to cast it
	const button = <button type='button'>Refresh</button> as HTMLButtonElement;
	this.renderSync(
		<>
			{button}
			<Spot key="quote" />
		</>
	);

	await fetchAndRender();

	const events = this.waitEvents(
		this.domEvent('click', { el: button })
	)
	for await (const _ of events) {
		// Disable the button: this prevents the element to be clicked twice
		button.disabled = true;
		await fetchAndRender();
		// Re-enable the button
		button.disabled = false;
	}
}
```

When a JSX element is created in SeqFlow, the type is a real HTML element. So, Typescript doesn't understand which real element is. This is why we have to cast the button to `HTMLButtonElement`. With this cast, we can use the `disabled` attribute to disable the button while the quote is being fetched.

## Conclusion

In this tutorial, we have learned how to handle the click events and how to avoid double fetches. We also learned how to use the `key` attribute to track the components. Now, we have a fully functional application that shows a random quote and allows the user to refresh it by clicking a button!

<div class="d-grid gap-2 col-6 mx-auto">
    <a href="/getting-started/configuration" class="btn btn-outline-primary btn-lg">Learn how to configure the application</a>
</div>
