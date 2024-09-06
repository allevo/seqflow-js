import type { SeqflowFunctionContext } from "seqflow-js";
import { Button, type ButtonComponent } from "seqflow-js-components";

export async function RefreshQuoteButton(this: SeqflowFunctionContext) {
	this.renderSync(
		<Button color="primary" key="button" type="button">
			Refresh quote
		</Button>,
	);
	const button = this.getChild<ButtonComponent>("button");

	const events = this.waitEvents(this.domEvent("click", { key: "button" }));
	for await (const _ of events) {
		button.transition({
			loading: true,
			disabled: true,
			replaceText: "Fetching...",
		});
		await this.app.domains.quotes.fetchNewQuote();
		button.transition({
			loading: false,
			disabled: false,
			replaceText: "__previous__",
		});
	}
}
