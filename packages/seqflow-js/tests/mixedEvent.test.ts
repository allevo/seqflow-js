import { expect, test } from "vitest";
import { ComponentParam, createDomainEventClass, start } from "../src/index";

const CounterChanged = createDomainEventClass<{
	delta: number;
	counter: number;
}>("counter", "changed");
const CounterReset = createDomainEventClass("counter", "reset-changed");
class CounterDomain {
	constructor(
		private eventTarget: EventTarget,
		private counter = 0,
	) {}

	applyDelta(delta: number) {
		this.counter += delta;
		this.eventTarget.dispatchEvent(
			new CounterChanged({ delta, counter: this.counter }),
		);
	}

	reset() {
		this.counter = 0;
		this.eventTarget.dispatchEvent(new CounterReset(null));
		return 0;
	}
}

test("dom & business event", async () => {
	async function ChangeButton({
		dom,
		event,
		data,
		domains,
	}: ComponentParam<{ delta: number }>) {
		dom.render("<button>Change</button>");
		const events = event.waitEvent(event.domEvent("click"));
		for await (const _ of events) {
			domains.counter.applyDelta(data.delta);
		}
	}
	async function app({ dom, event, domains }: ComponentParam) {
		let i = 0;

		dom.render(`
<div id="increment"></div>
<div id="decrement"></div>
<button id="reset">Reset</button>
<p id="result">${i}</p>
`);
		dom.child("increment", ChangeButton, { data: { delta: 1 } });
		dom.child("decrement", ChangeButton, { data: { delta: -1 } });

		const result = dom.querySelector<HTMLParagraphElement>("#result");
		const reset = dom.querySelector<HTMLButtonElement>("#reset");

		const events = event.waitEvent(
			event.domEvent("click"),
			event.domainEvent(CounterChanged),
		);
		for await (const event of events) {
			if (event instanceof CounterChanged) {
				i = event.detail.counter;
			} else if (event.target === reset) {
				i = domains.counter.reset();
			}
			result.textContent = `${i}`;
		}
	}

	const c = start(document.body, app, undefined, {
		domains: {
			counter: (eventTarget) => {
				return new CounterDomain(eventTarget);
			},
		},
	});

	const increment = document.querySelector(
		"#increment button",
	) as HTMLButtonElement;
	const decrement = document.querySelector(
		"#decrement button",
	) as HTMLButtonElement;
	const reset = document.querySelector("#reset") as HTMLButtonElement;
	const result = document.querySelector("#result") as HTMLParagraphElement;

	await new Promise((resolve) => setTimeout(resolve, 100));

	increment.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(result.textContent).toBe("1");

	increment.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(result.textContent).toBe("2");

	increment.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(result.textContent).toBe("3");

	decrement.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(result.textContent).toBe("2");

	decrement.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(result.textContent).toBe("1");

	decrement.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(result.textContent).toBe("0");

	decrement.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(result.textContent).toBe("-1");

	reset.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(result.textContent).toBe("0");

	c.abort("test");
	await new Promise((resolve) => setTimeout(resolve, 10));
});

declare module "../src/index" {
	interface Domains {
		counter: CounterDomain;
	}
}
