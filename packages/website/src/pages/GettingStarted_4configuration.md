Our application fully works now. But we can improve it putting the hard-coded URL as configuration. Let's do that.

## Application configuration

We have to define a configuration object that will hold the URL of the quote endpoint. Replace the `src/index.ts` file content with the following:

```ts
import { start } from "seqflow-js";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, undefined, {
	log: {
		info: (l: Log) => console.info(l),
		error: (l: Log) => console.error(l),
		debug: (l: Log) => console.debug(l),
	},
	// The configuration object
	config: {
		api: {
			// The URL of the quote endpoint
			baseUrl: "https://api.quotable.io",
		},
	}
});

// This is required to make typescript happy
declare module "seqflow-js" {
	interface ApplicationConfiguration {
		api: {
			baseUrl: string;
		};
	}
}
```

We defined a configuration object that holds the URL of the quote endpoint. We passed this object to the `start` function as the fourth argument.

Let's see how we can use this configuration object. Replace the `src/Main.tsx` file content with the following:

```tsx
import { SeqflowFunctionContext } from "seqflow-js";

interface Quote {
	author: string;
	content: string;
}

// Use the \`baseUrl\`
async function getRandomQuote(baseUrl: string): Promise<Quote> {
	const res = await fetch(\`\${baseUrl}/random\`)
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
			// this.app.config is the configuration object
			quote = await getRandomQuote(this.app.config.api.baseUrl);
		} catch (error) {
			this.replaceChild("quote", () => <ErrorMessage key="quote" message={error.message} />);
			return;
		}
		this.replaceChild("quote", () => <Quote key="quote" quote={quote} />);
	}

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
		button.disabled = true;
		await fetchAndRender();
		button.disabled = false;
	}
}
```

We changed the `getRandomQuote` function to receive the `baseUrl` as an argument. We used the `this.app.config` object to access the configuration object.

## Conclusion

Even if the configuration part is not commonly covered in tutorials, it's an essential part of any application. In this guide, we learned how to define a configuration object and how to use it in our application.

<div class="d-grid gap-2 col-6 mx-auto">
    <a href="/getting-started/test" class="btn btn-outline-primary btn-lg">Learn how to test the application</a>
</div>
