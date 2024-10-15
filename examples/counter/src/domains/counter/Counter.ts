import { createDomainEventClass } from "@seqflow/seqflow";

export const CounterChanged = createDomainEventClass<{
	beforeValue: number;
	delta: number;
	currentValue: number;
}, 'changed'>("counter", "changed");

export class CounterDomain {
	private counter: number;

	constructor(private eventTarget: EventTarget) {
		this.counter = 0;
	}

	applyDelta(delta: number) {
		const beforeValue = this.counter;
		this.counter += delta;
		this.eventTarget.dispatchEvent(
			new CounterChanged({
				beforeValue,
				delta,
				currentValue: this.counter,
			}),
		);
	}

	set(newValue: number) {
		const beforeValue = this.counter;
		const delta = newValue - this.counter;
		this.counter = newValue;
		this.eventTarget.dispatchEvent(
			new CounterChanged({
				beforeValue,
				delta,
				currentValue: this.counter,
			}),
		);
	}

	get() {
		return this.counter;
	}
}
