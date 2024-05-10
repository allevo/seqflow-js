import { SeqflowFunctionContext, createDomainEventClass } from "seqflow-js";
import classes from "./Counter.module.css";
import { CHANGE_VALUE_EVENT_NAME, ExternalChangeValue } from "./external";

const CounterChanged = createDomainEventClass("counter", "changed");

export class CounterDomain {
	private counter: number;

	constructor(
		private eventTarget: EventTarget,
		externalEventTarget: EventTarget,
		init = 0,
	) {
		this.counter = init;

		externalEventTarget.addEventListener(
			CHANGE_VALUE_EVENT_NAME,
			(e: ExternalChangeValue) => {
				this.set(e.detail.newValue);
			},
		);
	}

	applyDelta(delta: number) {
		this.counter += delta;
		this.eventTarget.dispatchEvent(
			new CounterChanged({ delta, counter: this.counter }),
		);
	}

	set(newValue: number) {
		const delta = newValue - this.counter;
		this.counter = newValue;
		this.eventTarget.dispatchEvent(
			new CounterChanged({ delta, counter: this.counter }),
		);
	}

	get() {
		return this.counter;
	}
}

async function ChangeCounterButton(
	this: SeqflowFunctionContext,
	data: { delta: number; text: string },
) {
	this._el.classList.add("change-counter-button-wrapper");
	this.renderSync(<button type="button">{data.text}</button>);
	const events = this.waitEvents(
		this.domEvent("click", { el: this._el as HTMLElement }),
	);
	for await (const _ of events) {
		this.app.domains.counter.applyDelta(data.delta);
	}
}

export async function Counter(this: SeqflowFunctionContext) {
	const counterDiv = <div>{this.app.domains.counter.get()}</div>;
	this.renderSync(
		<div class={classes.counter}>
			<ChangeCounterButton delta={-1} text="Decrement" />
			{counterDiv}
			<ChangeCounterButton delta={1} text="Increment" />
		</div>,
	);

	const events = this.waitEvents(this.domainEvent(CounterChanged));
	for await (const _ of events) {
		counterDiv.textContent = `${this.app.domains.counter.get()}`;
	}
}
