import { SeqflowFunctionContext, createDomainEventClass } from "seqflow-js";
import classes from "./Counter.module.css";
import { CHANGE_VALUE_EVENT_NAME, ExternalChangeValue } from "./external";

const CounterChanged = createDomainEventClass<{
	delta: number;
	counter: number;
}>("counter", "changed");

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
	this.renderSync(
		<button key="button" type="button">
			{data.text}
		</button>,
	);
	const events = this.waitEvents(this.domEvent("click", "button"));

	for await (const _ of events) {
		this.app.domains.counter.applyDelta(data.delta);
	}
}

export async function Counter(this: SeqflowFunctionContext) {
	this._el.classList.add(classes["counter-card"]);

	this.renderSync(
		<>
			<div className={classes.buttons}>
				<ChangeCounterButton delta={-1} text="Decrement" />
				<div className={classes.divider} />
				<ChangeCounterButton delta={1} text="Increment" />
			</div>
			<div className={classes.counter} key="counter">
				{this.app.domains.counter.get()}
			</div>
		</>,
	);

	const events = this.waitEvents(this.domainEvent(CounterChanged));
	for await (const ev of events) {
		this.getChild("counter").textContent = `${ev.detail.counter}`;
	}
}
