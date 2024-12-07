Now we have a working and tested application. It is time to re-organize the codebase. In this tutorial, we will cover how to split the application into domains.

## What is a domain

Before starting, let's try to define what a domain is.
There's no a unique and universal definition of a domain, but we can say that a domain is a part of the application that is responsible for a specific feature. It contains all the necessary components, services, and logic to implement the feature.

But let's make some examples:
- In a blog application, you can have a domain for the posts and another domain for the users. In this context, the posts domain will contain all the components and the logic to manage the posts, like the list of posts, the post detail, the post creation, and so on. The users domain will contain all the components and the logic to manage the current users and which users can see other users' posts.
- In an e-commerce application, you can have a domain for the products and another one for the cart. The products domain will contain all the components and the logic to manage the products, like the list of products, the product detail, the product search, and so on. The cart domain will contain all the components and the logic to manage the cart, like the list of products in the cart, the cart total, the cart checkout, and so on.

NB: When you split the application into domains, there's no an unique way: it really depends on your business logic and requirements. So, the above list is just an example.

## The `quote` domain

Our application is simple, but for the sake of this tutorial, we will move part of the current code into a domain. Our goal is to move all logics and components related to the quote into a folder.

Let's start by creating a file at this location: `src/domains/quotes/domain.ts`. In this file we will define our class and expose a method to get a random quote.

```tsx
import { createDomainEventClass } from "@seqflow/seqflow";

export interface Quote {
	author: string;
	content: string;
}

// This is a domain class event that is fired when we are fetching a new quote
export const FetchingNewQuote = createDomainEventClass<
	unknown, // We don't need any payload
	"fetching-new-quote"
>("quotes", "fetching-new-quote");

// This is another domain class event that is fired when we have a new quote
export const NewQuoteFetched = createDomainEventClass<
	Quote, // An event instance will contain the quote
	"new-quote-fetched"
>("quotes", "new-quote-fetched");

// This is another domain class event that is fired when we have an error fetching the quote
export const QuoteErrorFetched = createDomainEventClass<
	string,
	"quote-error-fetched"
>("quotes", "quote-error-fetched");

// This is the domain class
// This will be instanted once at the application start
export class QuoteDomain {
	constructor(
		// This event target is dedicated to this domain
		// all events emitted by this domain will be dispatched here
		private et: EventTarget,
		// This is the base URL of the quote API
		private baseUrl: string,
	) {}

    // This method will fetch a new quote
	async fetchNewQuote() {
		// Emit the event that we are fetching, no payload needed
		this.et.dispatchEvent(new FetchingNewQuote(null));

		let quote: Quote;
		try {
			// Fetch the quote
			const ret = await Promise.all([
				getRandomQuote(this.baseUrl),
				// Simulate a delay
				new Promise((r) => setTimeout(r, 500)),
			]);
			quote = ret[0];

			// Emit the event that we have a new quote
			this.et.dispatchEvent(new NewQuoteFetched(quote));
		} catch (e) {
			// Or emit the event that we have an error fetching the quote
			this.et.dispatchEvent(new QuoteErrorFetched("Failed to fetch quote"));
		}
	}
}

async function getRandomQuote(baseUrl: string): Promise<Quote> {
    const res = await fetch(\`\${baseUrl}/api/quotes/random\`);
    if (!res.ok) {
        throw new Error("Failed to fetch quote");
    }
    return await res.json();
}

```

So, if a component invokes `fetchNewQuote`, the domain will emit:
- the `FetchingNewQuote` event.
- the `NewQuoteFetched` event when the quote is correctly fetched.
- or the `QuoteErrorFetched` event if there's an error.

Our component can listen a domain event. Let's create a file at this location: `src/domains/quotes/components/Quote.tsx`.

```tsx
import { Prose } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import {
	FetchingNewQuote,
	NewQuoteFetched,
	type Quote,
	QuoteErrorFetched,
} from "../domain";

// This is a component that will render a quote. No logic here, just rendering
function QuoteProse(
	{ quote }: ComponentProps<{ quote: Quote }>,
	{ component }: Contexts,
) {
	component.renderSync(
		<Prose>
			<blockquote>
				<p>{quote.content}</p>
			</blockquote>
			<cite>{quote.author}</cite>
		</Prose>,
	);
}
// Loading component
function Loading({}, { component }: Contexts) {
	component.renderSync(<p>Loading...</p>);
}
// Show error
function ErrorMessage(data: { error: unknown }, { component }: Contexts) {
	if (data.error instanceof Error) {
		component.renderSync(<p>{data.error.message}</p>);
	} else {
		component.renderSync(<p>Unknown error</p>);
	}
}
// Free spot
function Spot() {}

// This component follows the domain event and reacts to them, rendering the appropriate component
export async function QuoteComponent(
	_: ComponentProps<unknown>,
	{ component }: Contexts,
) {
	component.renderSync(
		<>
			<Spot key="quote" />
		</>,
	);

	// Listen to the domain events
	const events = component.waitEvents(
		component.domainEvent(FetchingNewQuote),
		component.domainEvent(NewQuoteFetched),
		component.domainEvent(QuoteErrorFetched),
	);
	for await (const ev of events) {
		switch (true) {
			case ev instanceof FetchingNewQuote:
				component.replaceChild("quote", () => <Loading key="quote" />);
				break;
			case ev instanceof NewQuoteFetched:
				component.replaceChild("quote", () => (
					<QuoteProse key="quote" quote={ev.detail} />
				));
				break;
			case ev instanceof QuoteErrorFetched:
				component.replaceChild("quote", () => (
					<ErrorMessage key="quote" error={ev.detail} />
				));
				break;
		}
	}
}
```

With `QuoteComponent` we are able to refresh the quote independently from the rest of the application.
It completely decouples the quote logic from the button: we can trigger this logic from any component.

Now, let's create a file for the button at this location: `src/domains/quotes/components/RefreshQuoteButton.tsx`.

```tsx
import { Button, type ButtonComponent } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";

// This component is a button that will refresh the quote
export async function RefreshQuoteButton(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const refresh = async () => {
		const refreshButton = component.getChild<ButtonComponent>("button");
		refreshButton.transition({
			disabled: true,
			loading: true,
			loadingText: "Fetching...",
		});

        // Access to the domain and invoke the \`fetchNewQuote\` method
		await app.domains.quotes.fetchNewQuote();

		refreshButton.transition({
			loading: false,
			disabled: false,
		});
	};

	component.renderSync(
		<Button key="button" type="button">
			Refresh
		</Button>,
	);

	// Refresh the quote at the start
	await refresh();

	const events = component.waitEvents(component.domEvent("button", "click"));
	for await (const _ of events) {
		// Refresh the quote when the button is clicked
		await refresh();
	}
}
```

The `RefreshQuoteButton` component is a button that invokes the `fetchNewQuote` method of the `QuoteDomain` class.
The click on the button will fire `FetchingNewQuote` event, so the `QuoteComponent` will render the loading component.
When the quote is fetched, the `NewQuoteFetched` event is fired, and the `QuoteComponent` will render the quote, or the `QuoteErrorFetched` event is fired, and the `QuoteComponent` will render the error message.

In this way, we decoupled the quote logic from the UI.

## The application

We have all pieces in place. Now it is time to put them together.

Let's update the `src/Main.tsx` file.

```tsx
import { Contexts } from "@seqflow/seqflow";
import { QuoteComponent } from "./domains/quotes/components/Quote";
import { RefreshQuoteButton } from "./domains/quotes/components/RefreshQuoteButton";
import { QuoteDomain } from "./domains/quotes/domain";

export async function Main({}, { component, app }: Contexts) {
	component.renderSync(
		<>
			<QuoteComponent key="quote" />
			<RefreshQuoteButton key="button" />
		</>
	);
}

// This is required to make typescript happy
declare module "@seqflow/seqflow" {
	interface ApplicationConfiguration {
		api: {
			baseUrl: string;
		};
	}

	interface Domains {
		quotes: QuoteDomain;
	}
}
```

What we are missing is the domain instantiation. Let's update the `src/index.tsx` file.

```tsx
import "@seqflow/components/style.css";
import { start } from "@seqflow/seqflow";
import { Main } from "./Main";
import { QuoteDomain } from "./domains/quotes/domain";
import "./index.css";

start(
	document.getElementById("root")!,
	Main,
	{},
	{
		log: console,
		// The configuration object
		config: {
			api: {
				// The URL of the quote endpoint
				baseUrl: "https://quotes.seqflow.dev",
			},
		},
		domains: {
			quotes: (et, _, config) => new QuoteDomain(et, config.api.baseUrl),
		},
	},
);
```

**NB**: You should update the `tests/index.test.ts` file as well.

## Conclusion

The `Main` component is now very simple: it just renders the `QuoteComponent` and the `RefreshQuoteButton`.
The responsibility are segregated:
- the `QuoteDomain` class implements the main logic to fetch the quote.
- the `RefreshQuoteButton` component controls when the quote is refreshed, invoking the domain.
- the `QuoteComponent` component renders the appropriate component, listening to domain events.
- the `Main` component is to render the UI and decides where to put the quote and the button.

Amazing! We segregated rgw business logic from the UI logic. This is a good practice to make the codebase more maintainable and scalable.

:::next:::
{"label": "Conclusion", "next": "/get-started/conclusion"}
:::end-next:::
