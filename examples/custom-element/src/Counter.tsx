import {
	type SeqflowFunctionContext,
	createDomainEventClass,
} from "seqflow-js";
import { Button, Card } from "seqflow-js-components";
import classes from "./Counter.module.css";
import { CHANGE_VALUE_EVENT_NAME, type ExternalChangeValue } from "./external";

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

		externalEventTarget.addEventListener(CHANGE_VALUE_EVENT_NAME, (e) => {
			this.set((e as ExternalChangeValue).detail.newValue);
		});
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
		<Button key="button" type="button" color="primary">
			{data.text}
		</Button>,
	);
	const events = this.waitEvents(this.domEvent("click", { key: "button" }));

	for await (const _ of events) {
		this.app.domains.counter.applyDelta(data.delta);
	}
}

export async function Counter(this: SeqflowFunctionContext) {
	this._el.classList.add(classes["counter-card"]);

	this.renderSync(
		<Card
			compact
			className={"m-auto w-96 bg-slate-900 text-slate-200 mt-6"}
			shadow="md"
		>
			<Card.Body>
				<div className={classes.buttons}>
					<ChangeCounterButton delta={-1} text="Decrement" />
					<div className={classes.counter} key={"counter"}>
						{this.app.domains.counter.get()}
					</div>
					<ChangeCounterButton delta={1} text="Increment" />
				</div>
			</Card.Body>
		</Card>,
	);

	const events = this.waitEvents(this.domainEvent(CounterChanged));
	for await (const ev of events) {
		this.getChild("counter").textContent = `${ev.detail.counter}`;
	}
}
