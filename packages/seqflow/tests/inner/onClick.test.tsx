import { screen, waitFor } from "@testing-library/dom";
import { afterEach, beforeEach, expect, test } from "vitest";
import { SeqFlowComponentContext } from "../../src/index";
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
		{ local: "root", global: "root" },
	);
});
afterEach(() => {
	abortController.abort();
});

test("onClick: lifecycle", async () => {
	let clickCount = 0;
	function clicked() {
		clickCount++;
	}
	component.renderSync(
		<button type="button" onClick={clicked} key="div1">
			Button
		</button>,
	);

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
