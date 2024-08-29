import type { SeqflowFunctionContext } from "seqflow-js";
import { Card, Divider, Loading, Prose } from "seqflow-js-components";
import classes from "./Main.module.css";
import {
	FetchingNewQuote,
	NewQuoteFetched,
	type Quote,
	QuoteComponent,
	QuoteErrorFetched,
	RefreshQuoteButton,
} from "./domains/quote";

const emptyQuote: Quote = {
	author: "",
	content: "",
};

export async function Main(this: SeqflowFunctionContext) {
	this.renderSync(
		<Card className={[classes.main]} compact shadow="xl">
			<Card.Body>
				<div key="loading" />
				<Prose key="quote" className={classes.initialText}>
					<p>Click the button to read a quote</p>
				</Prose>
				<Divider />
				<Card.Actions>
					<RefreshQuoteButton key="refresh-button" />
				</Card.Actions>
			</Card.Body>
		</Card>,
	);

	const events = this.waitEvents(
		this.domainEvent(FetchingNewQuote),
		this.domainEvent(NewQuoteFetched),
		this.domainEvent(QuoteErrorFetched),
	);
	for await (const ev of events) {
		if (ev instanceof FetchingNewQuote) {
			this.replaceChild("loading", () => (
				<Loading className={classes.loading} key="loading" />
			));
			this.getChild("quote").classList.add(classes.hide);
		} else if (ev instanceof NewQuoteFetched) {
			this.replaceChild("quote", () => {
				return (
					<QuoteComponent
						key="quote"
						quote={ev.detail}
						className={classes.quote}
					/>
				);
			});
			this.replaceChild("loading", () => <div key="loading" />);
		} else if (ev instanceof QuoteErrorFetched) {
			this.replaceChild("quote", () => {
				return (
					<div key="quote" className={classes.quote}>
						{ev.detail}
					</div>
				);
			});
			this.replaceChild("loading", () => <div key="loading" />);
		}
	}
}
