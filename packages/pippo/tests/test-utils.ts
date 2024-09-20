import type { TaskContext } from "vitest";
import { type SeqflowComponent, start } from "../src";
import { createDomainEventClass } from "../src/domains";

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CounterChangedEvent = createDomainEventClass<
	{
		before: number;
		current: number;
	},
	"counter-changed"
>("counter", "counter-changed");
export type CounterChangedEvent = InstanceType<typeof CounterChangedEvent>;
export class CounterDomain {
	private count = 0;

	constructor(private readonly et: EventTarget) {}

	applyDelta(delta: number) {
		const before = this.count;

		this.count += delta;

		this.et.dispatchEvent(
			new CounterChangedEvent({
				before,
				current: this.count,
			}),
		);
	}

	setValue(value: number) {
		const before = this.count;

		this.count = value;

		this.et.dispatchEvent(
			new CounterChangedEvent({
				before,
				current: this.count,
			}),
		);
	}

	getCount() {
		return this.count;
	}
}

declare module "../src/types" {
	interface Domains {
		counter: CounterDomain;
	}
}

export function startTestApp(
	testContext: TaskContext<any>,
	App: SeqflowComponent<any>,
) {
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
}

function abortOnTestFinished(
	testContext: TaskContext<any>,
	abortController: AbortController,
) {
	testContext.onTestFinished(() => {
		abortController.abort();
	});
}
