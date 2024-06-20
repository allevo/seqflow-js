import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";

import {
	type CustomEventAsyncGenerator,
	type SeqflowFunctionContext,
	createCustomEventAsyncGenerator,
	start,
} from "../src/index";

class DeltaEvent extends CustomEvent<{ delta: number }> {
	constructor(delta: number) {
		super("delta", { detail: { delta } });
	}
}

test("domain event - increment", async () => {
	async function ChangeButton(
		this: SeqflowFunctionContext,
		{
			delta,
			text,
			pipe,
		}: {
			delta: number;
			text: string;
			pipe: CustomEventAsyncGenerator<DeltaEvent>;
		},
	) {
		this.renderSync(
			<button key="button" type="button">
				{text}
			</button>,
		);

		const events = this.waitEvents(this.domEvent("click", "button"));
		for await (const _ of events) {
			pipe.push(new DeltaEvent(delta));
		}
	}
	async function App(this: SeqflowFunctionContext) {
		const pipe = createCustomEventAsyncGenerator<DeltaEvent>();

		let counter = 0;
		this.renderSync(
			<div>
				<ChangeButton delta={1} text="increment" pipe={pipe} />
				<ChangeButton delta={-1} text="decrement" pipe={pipe} />
				<div key="counter">{counter}</div>
			</div>,
		);

		const events = this.waitEvents(pipe);
		for await (const e of events) {
			counter += e.detail.delta;
			this.getChild("counter").textContent = `${counter}`;
		}
	}

	start(document.body, App, {}, {});

	const incrementButton = await screen.findByText(/increment/i);
	const decrementButton = await screen.findByText(/decrement/i);

	await screen.findByText(/0/i);
	incrementButton.click();
	await screen.findByText(/1/i);
	incrementButton.click();
	await screen.findByText(/2/i);
	incrementButton.click();
	await screen.findByText(/3/i);

	for (let i = 0; i < 10; i++) {
		incrementButton.click();
	}

	await screen.findByText(/13/i);

	decrementButton.click();
	await screen.findByText(/12/i);
});
