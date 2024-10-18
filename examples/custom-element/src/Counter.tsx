import { Button, Card } from "@seqflow/components";
import {
	ComponentProps,
	Contexts,
	createDomainEventClass,
} from "@seqflow/seqflow";
import classes from "./Counter.module.css";
import { CHANGE_VALUE_EVENT_NAME, type ExternalChangeValue } from "./external";

const CounterChanged = createDomainEventClass<
	{
		delta: number;
		counter: number;
	},
	"changed"
>("counter", "changed");

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
	data: ComponentProps<{ delta: number; text: string }>,
	{ component, app }: Contexts,
) {
	component.renderSync(
		<Button key="button" type="button" color="primary">
			{data.text}
		</Button>,
	);
	const events = component.waitEvents(component.domEvent("button", "click"));

	for await (const _ of events) {
		app.domains.counter.applyDelta(data.delta);
	}
}

export async function Counter(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add(classes["counter-card"]);

	component.renderSync(
		<Card
			compact
			className={"m-auto w-96 bg-slate-900 text-slate-200 mt-6"}
			shadow="md"
		>
			<Card.Body>
				<div className={classes.buttons}>
					<ChangeCounterButton delta={-1} text="Decrement" />
					<div className={classes.counter} key={"counter"}>
						{app.domains.counter.get()}
					</div>
					<ChangeCounterButton delta={1} text="Increment" />
				</div>
			</Card.Body>
		</Card>,
	);

	const events = component.waitEvents(component.domainEvent(CounterChanged));
	for await (const ev of events) {
		component.getChild("counter").textContent = `${ev.detail.counter}`;
	}
}
