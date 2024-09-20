import { screen, waitFor } from "@testing-library/dom";
import { afterEach, beforeEach, expect, test } from "vitest";
import {
	type ComponentProps,
	type Contexts,
	SeqFlowComponentContext,
} from "../../src/index";
import { createAppForInnerTest, sleep } from "../test-utils";

let component: SeqFlowComponentContext;
let abortController: AbortController;
const logs: any[] = [];
beforeEach(() => {
	document.body.innerHTML = "";
	abortController = new AbortController();
	component = new SeqFlowComponentContext(
		document.body,
		abortController,
		createAppForInnerTest(logs),
	);
});
afterEach(() => {
	abortController.abort();
});

test("lifecicle", async () => {
	let clickCount = 0;
	function clicked() {
		clickCount++;
	}
	async function Button(_: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(
			<button type="button" onClick={clicked}>
				Button
			</button>,
		);
	}
	async function A(_: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<Button />);
	}

	component.renderSync(<A />);

	expect(clickCount).toBe(0);
	(await screen.findByText(/Button/i)).click();
	await waitFor(() => expect(clickCount).toBe(1));
	(await screen.findByText(/Button/i)).click();
	await waitFor(() => expect(clickCount).toBe(2));

	// Lifecycle ends
	abortController.abort();

	(await screen.findByText(/Button/i)).click();

	await sleep(100);

	await waitFor(() => expect(clickCount).toBe(2));
});
