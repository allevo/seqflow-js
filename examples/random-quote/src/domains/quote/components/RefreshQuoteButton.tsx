import { Button, type ButtonComponent } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function RefreshQuoteButton(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component.renderSync(
		<Button color="primary" key="button" type="button">
			Refresh quote
		</Button>,
	);
	const button = component.getChild<ButtonComponent>("button");

	const events = component.waitEvents(component.domEvent("button", "click"));
	for await (const _ of events) {
		button.transition({
			loading: true,
			disabled: true,
			replaceText: "Fetching...",
		});
		await app.domains.quotes.fetchNewQuote();
		button.transition({
			loading: false,
			disabled: false,
			replaceText: "__previous__",
		});
	}
}
