import { createDomainEventClass } from "seqflow-js";

export const CounterChanged = createDomainEventClass<{
	delta: number;
	counter: number;
}>("counter", "changed");
export const CounterReset = createDomainEventClass<{ counter: number }>(
	"counter",
	"reset",
);

export class CounterDomain {
	private counter: number;

	constructor(
		private eventTarget: EventTarget,
		private init = 0,
	) {
		this.counter = init;
	}

	applyDelta(delta: number) {
		this.counter += delta;
		this.eventTarget.dispatchEvent(
			new CounterChanged({ delta, counter: this.counter }),
		);
	}

	reset() {
		this.counter = this.init;
		this.eventTarget.dispatchEvent(new CounterReset({ counter: this.counter }));
	}

	get() {
		return this.counter;
	}
}

declare module "seqflow-js" {
	interface Domains {
		counter: CounterDomain;
	}
}
