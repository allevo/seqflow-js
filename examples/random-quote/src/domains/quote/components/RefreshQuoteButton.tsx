import { SeqflowFunctionContext } from "seqflow-js";
import { Button, ButtonComponent } from "seqflow-js-components";
import { FetchingNewQuote, NewQuoteFetched } from "../QuoteDomain";

export async function RefreshQuoteButton(this: SeqflowFunctionContext) {
	const refreshQuote = () => {
		this.app.domains.quotes.fetchNewQuote();
	};

	this.renderSync(
        <Button
            key="button"
            onClick={refreshQuote}
            label="Refresh quote"
            />);
    const button = this.getChild<ButtonComponent>('button')

    const events = this.waitEvents(
		this.domainEvent(FetchingNewQuote),
		this.domainEvent(NewQuoteFetched),
	);

	for await (const ev of events) {
		if (ev instanceof FetchingNewQuote) {
			button.transition({
                disabled: true,
                loading: true
            })
		} else if (ev instanceof NewQuoteFetched) {
			button.transition({
                disabled: false,
                loading: false
            })
		}
	}
}
