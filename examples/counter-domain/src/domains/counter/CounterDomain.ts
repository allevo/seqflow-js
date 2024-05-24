import { createDomainEventClass } from "seqflow-js";

export const CounterChanged = createDomainEventClass<{
	delta: number;
	counter: number;
}>("counter", "changed");

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

	get() {
		return this.counter;
	}
}
