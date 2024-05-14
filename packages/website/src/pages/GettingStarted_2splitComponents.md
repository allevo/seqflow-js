
Our application is simple, but where is the reusability? Let's split the application into components.

## Create new components

Let's start by creating a new component that will show the quote. Replace the `src/Main.tsx` file content with the following:

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

	this.renderSync(
		<Quote quote={quote} />
	);
}
```

In the above code, we created:
- a new component called `Loading` to show a loading message;
- a new component called `ErrorMessage` to show an error message.
- a new component called `Quote` to show the quote;

Finally, we updated the `Main` component accordingly.


## Conclusion

We split the application into multiple components.

In the next guide, we will learn how to handle user interactions.

<div class="d-grid gap-2 col-6 mx-auto">
    <a href="/getting-started/refresh-quote" class="btn btn-outline-primary btn-lg">Learn how to handle events</a>
</div>
