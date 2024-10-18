import { screen, waitFor } from "@testing-library/dom";
import { afterEach, beforeEach, expect, test } from "vitest";
import { domEvent } from "../../src/events";
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
	);
});
afterEach(() => {
	abortController.abort();
});

test("domEvent: click button", async () => {
	const abortController = new AbortController();
	component.renderSync(
		<button type="button" key="div1">
			Button
		</button>,
	);

	let clickCount = 0;
	const p = (async () => {
		const events = domEvent(component._el, "click", {});
		for await (const _ of events(abortController)) {
			clickCount++;
		}
	})();

	const button = await screen.findByText(/Button/i);

	expect(clickCount).toBe(0);
	button.click();
	await waitFor(() => expect(clickCount).toBe(1));
	button.click();
	await waitFor(() => expect(clickCount).toBe(2));

	// Lifecycle ends
	setTimeout(() => abortController.abort(), 10);

	await expect(p).rejects.toThrow();

	button.click();

	await sleep(100);

	await waitFor(() => expect(clickCount).toBe(2));
});

// stop propagation means:
// I will execute the handlers registed on the current element
// I will not execute the handles registered on the parent elements
test("domEvent: stopPropagation", async () => {
	component.renderSync(
		<button type="button" key="div1">
			Button
		</button>,
	);
	let bodyClickCount = 0;
	document.body.addEventListener(
		"click",
		(_) => {
			bodyClickCount++;
		},
		{
			signal: abortController.signal,
		},
	);

	const innerAbortController = new AbortController();

	let buttonClickCount = 0;
	const buttonClickPromise = (async () => {
		const events = domEvent(component.getChild("div1"), "click", {
			stopPropagation: true,
		});
		for await (const _ of events(innerAbortController)) {
			buttonClickCount++;
		}
	})();
	let componentClickCount = 0;
	const componentClickPromise = (async () => {
		const events = domEvent(component._el, "click", {});
		for await (const _ of events(innerAbortController)) {
			componentClickCount++;
		}
	})();

	const button = await screen.findByText(/Button/i);

	expect(buttonClickCount).toBe(0);
	expect(componentClickCount).toBe(0);
	expect(bodyClickCount).toBe(0);
	button.click();
	await waitFor(() => expect(buttonClickCount).toBe(1));
	expect(componentClickCount).toBe(0);
	expect(bodyClickCount).toBe(0);
	button.click();
	await waitFor(() => expect(buttonClickCount).toBe(2));
	expect(componentClickCount).toBe(0);
	expect(bodyClickCount).toBe(0);

	// Lifecycle ends
	setTimeout(() => innerAbortController.abort(), 10);

	await expect(buttonClickPromise).rejects.toThrow();
	await expect(componentClickPromise).rejects.toThrow();

	button.click();

	await sleep(100);

	await waitFor(() => expect(buttonClickCount).toBe(2));
	expect(componentClickCount).toBe(0);
	expect(bodyClickCount).toBe(1);
});

// stop immediate propagation means:
// I will execute the current handler registed on the current element
// I will not execute the remain handlers and the handles registered on the parent elements
// NB: stopImmediatePropagation implies stopPropagation
test("domEvent: stopImmediatePropagation", async () => {
	component.renderSync(
		<button type="button" key="div1">
			Button
		</button>,
	);
	let bodyClickCount = 0;
	document.body.addEventListener(
		"click",
		(_) => {
			bodyClickCount++;
		},
		{
			signal: abortController.signal,
		},
	);

	const innerAbortController = new AbortController();

	let buttonClickCount = 0;
	const buttonClickPromise = (async () => {
		const events = domEvent(component.getChild("div1"), "click", {
			stopImmediatePropagation: true,
		});
		for await (const _ of events(innerAbortController)) {
			buttonClickCount++;
		}
	})();
	let buttonClickCount2 = 0;
	const componentClickPromise = (async () => {
		const events = domEvent(component.getChild("div1"), "click", {});
		for await (const _ of events(innerAbortController)) {
			buttonClickCount2++;
		}
	})();

	const button = await screen.findByText(/Button/i);

	expect(buttonClickCount).toBe(0);
	expect(buttonClickCount2).toBe(0);
	expect(bodyClickCount).toBe(0);
	button.click();
	await waitFor(() => expect(buttonClickCount).toBe(1));
	expect(buttonClickCount2).toBe(0);
	expect(bodyClickCount).toBe(0);
	button.click();
	await waitFor(() => expect(buttonClickCount).toBe(2));
	expect(buttonClickCount2).toBe(0);
	expect(bodyClickCount).toBe(0);

	// Lifecycle ends
	setTimeout(() => innerAbortController.abort(), 10);

	await expect(buttonClickPromise).rejects.toThrow();
	await expect(componentClickPromise).rejects.toThrow();

	button.click();

	await sleep(100);

	await waitFor(() => expect(buttonClickCount).toBe(2));
	expect(buttonClickCount2).toBe(0);
	expect(bodyClickCount).toBe(1);
});

test("domEvent: prevent default", async () => {
	component.renderSync(
		<form key="form">
			<button type="button" key="submitButton">
				Button
			</button>
		</form>,
	);

	const innerAbortController = new AbortController();

	let buttonClickCount = 0;
	const buttonClickPromise = (async () => {
		const events = domEvent(component.getChild("submitButton"), "click", {
			preventDefault: true,
		});
		for await (const _ of events(innerAbortController)) {
			buttonClickCount++;
		}
	})();
	let submitCount = 0;
	const componentClickPromise = (async () => {
		const events = domEvent(component.getChild("form"), "submit", {});
		for await (const _ of events(innerAbortController)) {
			submitCount++;
		}
	})();

	const button = await screen.findByText(/Button/i);

	expect(buttonClickCount).toBe(0);
	expect(submitCount).toBe(0);

	button.click();
	await waitFor(() => expect(buttonClickCount).toBe(1));
	expect(submitCount).toBe(0);

	button.click();
	await waitFor(() => expect(buttonClickCount).toBe(2));
	expect(submitCount).toBe(0);

	// Lifecycle ends
	setTimeout(() => innerAbortController.abort(), 10);

	await expect(buttonClickPromise).rejects.toThrow();
	await expect(componentClickPromise).rejects.toThrow();
});
