
The quote application is a simple application that fetches a random quote from an endpoint and shows it in the browser. We will use the [Quotable API](https://api.quotable.io/random) as the quote endpoint.

## Invoking an API

Change the `src/Main.tsx` file content as the following:

```tsx
import { SeqflowFunctionContext } from "seqflow-js";

interface Quote {
	author: string;
	content: string;
}

// This is the function that fetches a random quote
async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://api.quotable.io/random")
	return await res.json();
}

// This is the main component: this is an async function!
export async function Main(this: SeqflowFunctionContext) {
	// Fetch a random quote
	const quote = await getRandomQuote();

	// And show it
	this.renderSync(
		<>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</>
	);
}
```

Let's see what we have.

We defined the `getRandomQuote` function that fetches a random quote from the Quotable API. It is an async function that returns a promise with the quote.

The `Main` async function is responsible for invoking the `getRandomQuote` function and showing the quote.
Because the SeqFlow components are async functions, we can just use the `await` keyword to perform any asynchronous operations we want, such HTTP requests. This is a powerful feature that allows you to fetch data from an endpoint and render it in the browser without any state management.

Every SeqFlow component is binded to a own context object that exposes some functions to interact with the DOM. In this case we want to render the quote, so we use the `this.renderSync` method to render the quote in the browser. As you can see, SeqFlow supports JSX syntax.

SeqFlow invokes your component once. If you want to update the component, you need to call the `this.renderSync` method again. But let's see where we can use this feature.

## Handle loading and error states

Even if we thought API requests are always fast and successful, they are not. Let's handle the loading and error states.
Let's do that. Replace the `src/Main.tsx` file content with the following:

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

export async function Main(this: SeqflowFunctionContext) {
	// Render loading message
	this.renderSync(
		<p>Loading...</p>
	);

	// Async operation may fail
	let quote: Quote;
	try {
		quote = await getRandomQuote();
	} catch (error) {
		// In case of error, render error message
		this.renderSync(
			<p>Error: {error.message}</p>
		);
		return;
	}

	// Replace loading message with quote
	this.renderSync(
		<div>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</div>
	);
}
```

We changed the `Main` component to render a loading message before fetching the quote. If the fetch operation fails, we render an error message. Otherwise, we render the quote.

SeqFlow components can replace own content just by calling the `renderSync` method again. In this case, the loading message is replaced by the quote component or the error message. Nice, right?

## Conclusion

In this guide, we learned how to fetch data from an endpoint and render it using SeqFlow. We also learned how to handle loading and error states.

In the next guide, we will learn how to split the above code into multiple components to make it more maintainable.

:::next:::
{"label": "Learn how to split application into components", "next": "/getting-started/split-components"}
:::end-next:::
