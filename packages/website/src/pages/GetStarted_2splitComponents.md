
Our application is simple for now.
But typically, applications are more complex and have multiple components.
Let's split the application into different components.

## Create new components

Let's start by creating a new component that will show the quote.
We continue to overwrite the `src/Main.tsx` file just to keep things simple to follow.

Replace the `src/Main.tsx` file content with the following:

```tsx
import { Prose } from "@seqflow/components";
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
		<Quote quote={quote} />
	);
}
```

As you can see, SeqFlow components can be created as sync or async functions that accept two parameters:
- the component properties;
- the context object used to interact with the component.

In the above code, we created:
- the `Loading` component to show a loading message;
- the `ErrorMessage` component to show an error message.
- the `Quote` component to show the quote;

Finally, we updated the `Main` component accordingly.

## Conclusion

We split the application into multiple components.

In the next guide, we will learn how to handle user interactions.

:::next:::
{"label": "Refresh the quote", "next": "/get-started/refresh-quote"}
:::end-next:::
