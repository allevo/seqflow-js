import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";

import {
	type SeqflowFunctionContext,
	createDomainEventClass,
	start,
} from "../src/index";

test("domain event - increment", async () => {
	async function ChangeButton(
		this: SeqflowFunctionContext,
		{ delta, text }: { delta: number; text: string },
	) {
		const button = <button type="button">{text}</button>;
		this.renderSync(button);

		const events = this.waitEvents(
			this.domEvent("click", {
				el: button,
			}),
		);
		for await (const _ of events) {
			this.app.domains.counter.applyDelta(delta);
		}
	}
	async function App(this: SeqflowFunctionContext) {
		const counterSpan = <span>{this.app.domains.counter.get()}</span>;
		this.renderSync(
			<div>
				<ChangeButton delta={1} text="increment" />
				<ChangeButton delta={-1} text="decrement" />
				{counterSpan}
			</div>,
		);

		const events = this.waitEvents(this.domainEvent(CounterChanged));
		for await (const e of events) {
			counterSpan.textContent = `${e.detail.counter}`;
		}
	}

	start(
		document.body,
		App,
		{},
		{
			domains: {
				counter: (eventTarget) => {
					return new CounterDomain(eventTarget);
				},
			},
		},
	);

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

declare module "../src/index" {
	interface Domains {
		counter: CounterDomain;
	}
}

const CounterChanged = createDomainEventClass<{ counter: number }>(
	"counter",
	"changed",
);
class CounterDomain {
	private counter = 0;

	constructor(private eventTarget: EventTarget) {}

	get() {
		return this.counter;
	}

	applyDelta(delta: number) {
		this.counter += delta;
		this.eventTarget.dispatchEvent(
			new CounterChanged({ counter: this.counter }),
		);
	}
}
