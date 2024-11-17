import { Button, type ButtonComponent } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function RefreshQuoteButton(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const f = async () => {
		const refreshButton = component.getChild<ButtonComponent>("button");
		refreshButton.transition({
			disabled: true,
			loading: true,
			loadingText: "Fetching...",
		});

		await app.domains.quotes.fetchNewQuote();

		refreshButton.transition({
			loading: false,
			disabled: false,
		});
	};

	component.renderSync(
		<Button key="button" type="button">
			Refresh quote
		</Button>,
	);

	await f();

	const events = component.waitEvents(component.domEvent("button", "click"));
	for await (const _ of events) {
		await f();
	}
}
