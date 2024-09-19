import { waitFor } from "@testing-library/dom";
import { type TaskContext, beforeEach, expect, test } from "vitest";
import { type ComponentProps, type Contexts, start } from "../src/index";
import { CounterDomain } from "./test-utils";

beforeEach(() => {
	document.body.innerHTML = "";
});

test("the application starts", async (testContext) => {
	let invokedCounter = 0;
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		invokedCounter++;
		component.renderSync(<div>App</div>);
	}
	const abortController = start(
		document.body,
		App,
		{},
		{
			domains: {
				counter: (et) => new CounterDomain(et),
			},
		},
	);
	abortOnTestFinished(testContext, abortController);

	await waitFor(() =>
		expect(document.body.innerHTML).toBe("<div><div>App</div></div>"),
	);
	expect(invokedCounter).toBe(1);
});

test("render child", async (testContext) => {
	async function Child(_: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<div>Child</div>);
	}
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<Child />);
	}
	const abortController = start(
		document.body,
		App,
		{},
		{
			domains: {
				counter: (et) => new CounterDomain(et),
			},
		},
	);
	abortOnTestFinished(testContext, abortController);

	await waitFor(() =>
		expect(document.body.innerHTML).toBe(
			"<div><div><div>Child</div></div></div>",
		),
	);
});

function abortOnTestFinished(
	testContext: TaskContext<any>,
	abortController: AbortController,
) {
	testContext.onTestFinished(() => {
		abortController.abort();
	});
}
