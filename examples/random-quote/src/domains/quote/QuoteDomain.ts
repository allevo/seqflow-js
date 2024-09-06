import { createDomainEventClass } from "seqflow-js";

export interface Quote {
	content: string;
	author: string;
}

export const FetchingNewQuote = createDomainEventClass<unknown>(
	"quotes",
	"fetching-new-quote",
);
export const NewQuoteFetched = createDomainEventClass<Quote>(
	"quotes",
	"new-quote-fetched",
);
export const QuoteErrorFetched = createDomainEventClass<string>(
	"quotes",
	"quote-error-fetched",
);

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
				new Promise((r) => setTimeout(r, 500)),
			]);
			quote = ret[0];

			this.et.dispatchEvent(new NewQuoteFetched(quote));
		} catch (e) {
			this.et.dispatchEvent(new QuoteErrorFetched("Failed to fetch quote"));
		}
	}
}

const quotes: Quote[] = [
	{
		author: "Me",
		content: "Quote 1",
	},
	{
		author: "You",
		content: "Quote 2",
	},
	{
		author: "They",
		content: "Quote 3",
	},
];
const index = 0;
async function getRandomQuote(baseUrl: string): Promise<Quote> {
	// return quotes[(index ++) % quotes.length]
	const res = await fetch(`${baseUrl}/random`);
	return await res.json();
}
