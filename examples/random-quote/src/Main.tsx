import { SeqflowFunctionContext } from "seqflow-js";
import { Card, Divider, Loading } from "seqflow-js-components";
import classes from "./Main.module.css";
import {
	FetchingNewQuote,
	NewQuoteFetched,
	Quote,
	QuoteComponent,
	RefreshQuoteButton,
} from "./domains/quote";

const emptyQuote: Quote = {
	author: "",
	content: "",
};

export async function Main(this: SeqflowFunctionContext) {
	// this._el.setAttribute('data-theme', "dark")

	this.renderSync(
		<Card wrapperClass={[classes.main]} compact shadow="xl">
			<Card.Body>
				<div key="loading" />
				<QuoteComponent
					key="quote"
					quote={emptyQuote}
					wrapperClass={classes.quote}
				/>
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
	);
	setTimeout(() => {
		this.getChild("refresh-button").querySelector("button")!.click();
	}, 0);

	for await (const ev of events) {
		if (ev instanceof FetchingNewQuote) {
			this.replaceChild("loading", () => (
				<Loading wrapperClass={classes.loading} key="loading" />
			));
			this.getChild("quote").classList.add(classes.hide);
		} else if (ev instanceof NewQuoteFetched) {
			this.replaceChild("quote", () => {
				return (
					<QuoteComponent
						key="quote"
						quote={ev.detail}
						wrapperClass={classes.quote}
					/>
				);
			});
			this.replaceChild("loading", () => <div key="loading" />);
		}
	}
}
