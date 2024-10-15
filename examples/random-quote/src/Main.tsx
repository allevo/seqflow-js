import { Card, Divider, Loading, Prose } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import classes from "./Main.module.css";
import {
	FetchingNewQuote,
	NewQuoteFetched,
	QuoteComponent,
	QuoteErrorFetched,
	RefreshQuoteButton,
} from "./domains/quote";

export async function Main(
	_: ComponentProps<unknown>,
	{ component }: Contexts,
) {
	component.renderSync(
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

	const events = component.waitEvents(
		component.domainEvent(FetchingNewQuote),
		component.domainEvent(NewQuoteFetched),
		component.domainEvent(QuoteErrorFetched),
	);
	for await (const ev of events) {
		if (ev instanceof FetchingNewQuote) {
			component.replaceChild("loading", () => (
				<Loading className={classes.loading} key="loading" />
			));
			component.getChild("quote").classList.add(classes.hide);
		} else if (ev instanceof NewQuoteFetched) {
			component.replaceChild("quote", () => {
				return (
					<QuoteComponent
						key="quote"
						quote={ev.detail}
						className={classes.quote}
					/>
				);
			});
			component.replaceChild("loading", () => <div key="loading" />);
		} else if (ev instanceof QuoteErrorFetched) {
			component.replaceChild("quote", () => {
				return (
					<div key="quote" className={classes.quote}>
						{ev.detail}
					</div>
				);
			});
			component.replaceChild("loading", () => <div key="loading" />);
		}
	}
}
