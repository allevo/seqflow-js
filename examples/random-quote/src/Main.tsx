import { Contexts } from "@seqflow/seqflow";
import {
	FetchingNewQuote,
	NewQuoteFetched,
	QuoteComponent,
	QuoteErrorFetched,
	RefreshQuoteButton,
} from "./domains/quote";
import classes from './Main.module.css'

function Loading({}, { component }: Contexts) {
	component.renderSync(<p>Loading...</p>);
}
function ErrorMessage(data: { error: unknown }, { component }: Contexts) {
	if (data.error instanceof Error) {
		component.renderSync(<p>{data.error.message}</p>);
	} else {
		component.renderSync(<p>Unknown error</p>);
	}
}

function Spot() {}

export async function Main({}, { component }: Contexts) {
	component._el.classList.add(...[classes.main]);
	component.renderSync(
		<>
			<RefreshQuoteButton key="refresh-button" />
			<Spot key="quote" />
		</>,
	);

	const events = component.waitEvents(
		component.domainEvent(FetchingNewQuote),
		component.domainEvent(NewQuoteFetched),
		component.domainEvent(QuoteErrorFetched),
	);
	for await (const ev of events) {
		switch (true) {
			case ev instanceof FetchingNewQuote: {
				component.replaceChild("quote", () => <Loading className={classes.quote} key="quote" />);
				break;
			}
			case ev instanceof NewQuoteFetched: {
				component.replaceChild("quote", () => (
					<QuoteComponent className={classes.quote} key="quote" quote={ev.detail} />
				));
				break;
			}
			case ev instanceof QuoteErrorFetched: {
				component.replaceChild("quote", () => (
					<ErrorMessage key="quote" error={ev.detail} />
				));
				break;
			}
		}
	}
}
