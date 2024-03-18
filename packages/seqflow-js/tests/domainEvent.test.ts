import { expect, test } from "vitest";
import { ComponentParam, createDomainEventClass, start } from "../src/index";

test("domain even", async () => {
	async function IncrementButton({ dom, event, domains }: ComponentParam) {
		dom.render('<button type="button">increment</button>');

		const events = event.waitEvent(event.domEvent("click"));
		for await (const _ of events) {
			domains.counter.increment();
		}
	}
	async function app({ dom, event }: ComponentParam) {
		const i = 0;
		dom.render(`<div><div id="button"></div><p id="result">${i}</p></div>`);
		dom.child("button", IncrementButton);

		const result = dom.querySelector<HTMLParagraphElement>("#result");

		const events = event.waitEvent(event.domainEvent(CounterChanged));
		for await (const ev of events) {
			result.textContent = `${ev.detail.counter}`;
		}
	}

	start(document.body, app, undefined, {
		log(l) {},
		domains: {
			counter: (eventTarget) => {
				return new CounterDomain(eventTarget);
			},
		},
	});

	document.body.querySelector("button")?.click();
	await new Promise((resolve) => setTimeout(resolve, 10));

	expect(document.body.innerHTML).toBe(
		'<div><div id="button"><button type="button">increment</button></div><p id="result">1</p></div>',
	);

	document.body.querySelector("button")?.click();
	document.body.querySelector("button")?.click();
	document.body.querySelector("button")?.click();
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(document.body.innerHTML).toBe(
		'<div><div id="button"><button type="button">increment</button></div><p id="result">4</p></div>',
	);
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
	constructor(
		private et: EventTarget,
		private _counter = 0,
	) {}
	increment() {
		this._counter++;
		this.et.dispatchEvent(new CounterChanged({ counter: this._counter }));
	}
}
