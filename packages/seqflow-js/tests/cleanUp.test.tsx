import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";

import { type SeqflowFunctionContext, start } from "../src/index";

test("cleanUp", async () => {
	let counter = 0;
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(<button type="button">click me</button>);

		const events = this.waitEvents(this.domEvent("click", { el: this._el }));
		for await (const _ of events) {
			counter += 1;
		}
	}

	const abortController = start(document.body, App, {}, {});

	const incrementButton = await screen.findByText(/click me/i);
	await waitFor(() => expect(counter).toBe(0));
	incrementButton.click();
	await waitFor(() => expect(counter).toBe(1));

	abortController.abort("Stop the app");

	incrementButton.click();
	await waitFor(() => expect(counter).toBe(1));

	// The app is stopped, but no one remove the existing dom
	await screen.findByText(/click me/i);
});
