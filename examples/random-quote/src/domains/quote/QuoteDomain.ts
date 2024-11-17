import { createDomainEventClass } from "@seqflow/seqflow";

export interface Quote {
	content: string;
	author: string;
}

export const FetchingNewQuote = createDomainEventClass<
	unknown,
	"fetching-new-quote"
>("quotes", "fetching-new-quote");
export const NewQuoteFetched = createDomainEventClass<
	Quote,
	"new-quote-fetched"
>("quotes", "new-quote-fetched");
export const QuoteErrorFetched = createDomainEventClass<
	string,
	"quote-error-fetched"
>("quotes", "quote-error-fetched");

export class QuoteDomain {
	constructor(
		private et: EventTarget,
		private baseUrl: string,
	) {}

	async fetchNewQuote() {
		this.et.dispatchEvent(new FetchingNewQuote(null));

		let quote: Quote;
		try {
			const ret = await Promise.all([
				getRandomQuote(this.baseUrl),
				// Simulate a delay
				new Promise((r) => setTimeout(r, 500)),
			]);
			quote = ret[0];

			this.et.dispatchEvent(new NewQuoteFetched(quote));
		} catch (e) {
			this.et.dispatchEvent(new QuoteErrorFetched("Failed to fetch quote"));
		}
	}
}

async function getRandomQuote(baseUrl: string): Promise<Quote> {
	const res = await fetch(`${baseUrl}/api/quotes/random`);

	if (!res.ok) {
		throw new Error("Failed to fetch quote");
	}

	const body = await res.json();

	// TODO: validate the quote in a more robust way...
	if (!body.content || !body.author) {
		throw new Error("Invalid quote");
	}

	return {
		content: body.content,
		author: body.author,
	}
}
