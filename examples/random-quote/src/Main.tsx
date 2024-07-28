import { SeqflowFunctionContext } from "seqflow-js";
import { Card, Divider } from "seqflow-js-components";
import {
	FetchingNewQuote,
	NewQuoteFetched,
	Quote,
	QuoteComponent,
	RefreshQuoteButton,
} from "./domains/quote";
import classes from './Main.module.css';

type LoadingComponent = HTMLDivElement & {
	hide: () => void;
	show: () => void;
};
async function Loading(this: SeqflowFunctionContext) {
	this.renderSync(<div>loading...</div>);
	this._el.classList.add(classes.loading);

	const el = this._el as LoadingComponent;
	el.hide = () => {
		el.classList.add(classes.hide);
	};
	el.show = () => {
		el.classList.remove(classes.hide);
	};
}

const emptyQuote: Quote = {
	author: "",
	content: "",
};

export async function Main(this: SeqflowFunctionContext) {
	// this._el.setAttribute('data-theme', "dark")

	this.renderSync(
		<Card wrapperClass={[classes.main]} compact shadow="xl">
			<Card.Body>
				<Loading key="loading" />
				<QuoteComponent key="quote" quote={emptyQuote} wrapperClass={classes.quote} />
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
	}, 0)

	for await (const ev of events) {
		console.log(ev)
		if (ev instanceof FetchingNewQuote) {
			this.getChild<LoadingComponent>("loading").show();
			this.getChild("quote").classList.add(classes.hide);
		} else if (ev instanceof NewQuoteFetched) {
			this.replaceChild("quote", () => {
				return <QuoteComponent key="quote" quote={ev.detail} wrapperClass={classes.quote} />;
			});
			this.getChild<LoadingComponent>("loading").hide();
		}
	}
}
