
The quote application is a simple application that fetches a random quote from an endpoint and shows it in the browser. We will use this remote servive provided by SeqFlow to fetch quotes: [https://quotes.seqflow.dev](https://quotes.seqflow.dev).

## Invoking an API

What we want to do is to fetch a random quote from the endpoint `https://quotes.seqflow.dev/api/quotes/random` and show it in the component.
We will use the `fetch` API to do that.

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

We defined the `getRandomQuote` function that fetches a random quote from an endpoint. It is an pure async function that returns a promise with the quote.

The `Main` component is responsible for invoking the `getRandomQuote` function and showing the quote.
Because the SeqFlow components are async functions, we can just use the `await` keyword to perform any asynchronous operations we want, such HTTP requests. This is a powerful feature that allows us to write a component easier and more readable.

Every SeqFlow component accepts as a second parameter its own context object that exposes some functions to interact with the DOM. In this case we want to render the quote, so we use the `component.renderSync` method to render the quote in the browser. As you can see, SeqFlow supports JSX syntax.

Your page should be updated automatically thanks to the vite server. if you don't run the server yet, you can do it by running `pnpm start` in the terminal and navigate to `http://localhost:5173` to see the quote.

## Handle loading and error states

Even if we thought API requests are always fast and successful, they are not. Let's handle the loading and error states.

Let's put a loading message before fetching the quote and an error message if the fetch operation fails.
Replace the `src/Main.tsx` file content with the following:

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
