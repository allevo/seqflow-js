
The quote application is a simple application that fetches a random quote from an endpoint and shows it in the browser. We will use [this endpoint](https://quotes.seqflow.dev) for fetching the quote.

## Invoking an API

Change the `src/Main.tsx` file content as the following:

```tsx
import { Prose } from "@seqflow/components";
import { Contexts } from "@seqflow/seqflow";

interface Quote {
	author: string;
	content: string;
}

// This is the function that fetches a random quote
async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://quotes.seqflow.dev/api/quotes/random")
	return await res.json();
}

// This is the main component: this is an async function!
export async function Main({}, { component }: Contexts) {
	// Fetch a random quote
	const quote = await getRandomQuote();

	// And show it
	component.renderSync(
		<Prose>
			<p>{quote.content}</p>
			<p>{quote.author}</p>
		</Prose>
	);
}
```

Let's see what we have.

We defined the `getRandomQuote` function that fetches a random quote from an endpoint. It is an async function that returns a promise with the quote.

The `Main` async component is responsible for invoking the `getRandomQuote` function and showing the quote.
Because the SeqFlow components are async functions, we can just use the `await` keyword to perform any asynchronous operations we want, such HTTP requests. This is a powerful feature that allows you to fetch data from an endpoint and render it in the browser without any state management.

Every SeqFlow component accepts as a second parameter its own context object that exposes some functions to interact with the DOM. In this case we want to render the quote, so we use the `component.renderSync` method to render the quote in the browser. As you can see, SeqFlow supports JSX syntax.

SeqFlow invokes your component once. To update it, you need to call the `component.renderSync` method again or update the component partially with `component.replaceChild`.

Run `pnpm start` and navigate to `http://localhost:5173` to see the quote.

## Handle loading and error states

Even if we thought API requests are always fast and successful, they are not. Let's handle the loading and error states.
Let's do that. Replace the `src/Main.tsx` file content with the following:

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

export async function Main({}, { component }: Contexts) {
	// Render loading message
	component.renderSync(
		<p>Loading...</p>
	);

	// Async operation may fail
	let quote: Quote;
	try {
		quote = await getRandomQuote();
	} catch (error) {
		// In case of error, render error message
		component.renderSync(
			<p>Error: {error}</p>
		);
		return;
	}

	// Replace loading message with quote
	component.renderSync(
		<div>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</div>
	);
}
```

We changed the `Main` component to render a loading message before fetching the quote. If the fetch operation fails, we render an error message. Otherwise, we render the quote.

SeqFlow components can replace their own content just by calling the `renderSync` method again. In this case, the loading message is replaced by the quote component or the error message. Nice, right?

## Conclusion

In this guide, we learned how to fetch and render data from an endpoint using SeqFlow and how to handle loading and error states.

On the next page, we will learn how to split the above code into multiple components to make it more maintainable.

:::next:::
{"label": "Learn how to split application into components", "next": "/get-started/split-components"}
:::end-next:::
