Our application fully works now. But we can improve it by putting the hard-coded URL in configuration. Let's do that.

## Application configuration

We have to define a configuration object that will hold the URL of the quote endpoint. Replace the `src/index.ts` file content with the following:

```ts
import "@seqflow/components/style.css";
import { start } from "@seqflow/seqflow";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root")!, Main, {}, {
	log: console,
	// The configuration object
	config: {
		api: {
			// The URL of the quote endpoint
			baseUrl: "https://quotes.seqflow.dev",
		},
	}
});

// This is required to make typescript happy
declare module "@seqflow/seqflow" {
	interface ApplicationConfiguration {
		api: {
			baseUrl: string;
		};
	}
}
```

We defined a configuration object that holds the URL of the quote endpoint. As the fourth argument, we passed this object to the `start` function.

Let's see how we can use this configuration object. Replace the `src/Main.tsx` file content with the following:

```tsx
import { Button, ButtonComponent, Prose } from "@seqflow/components";
import { Contexts } from "@seqflow/seqflow";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(baseUrl: string): Promise<Quote> {
	const res = await fetch(\`\${baseUrl}/api/quotes/random\`)
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

export async function Main({}, { component, app }: Contexts) {
	const fetchAndRender = async () => {
		const refreshButton = component.getChild<ButtonComponent>('refresh-button');

		refreshButton.transition({
			disabled: true,
			loading: true,
			loadingText: 'Fetching...',
		})

		component.replaceChild("quote", () => <Loading key="quote" />);

		let quote: Quote;
		try {
			// Use \`app.config.api.baseUrl\` to get the URL
			quote = await getRandomQuote(app.config.api.baseUrl);
		} catch (error) {
			component.replaceChild("quote", () => <ErrorMessage key="quote" error={error} />);
			return;
		}
		component.replaceChild("quote", () => <Quote key="quote" quote={quote} />);

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

We changed the `getRandomQuote` function to receive the `baseUrl` as an argument. We used the `app.config` object to access the configuration object.

## Conclusion

Even if the configuration part is not commonly covered in tutorials, it's essential to any application. In this guide, we learned how to define a configuration object and how to use it in our application.

:::next:::
{"label": "Learn how to test the application", "next": "/get-started/test"}
:::end-next:::
