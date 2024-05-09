import { SeqflowFunctionContext } from "seqflow-js";
import {
	CounterChanged,
	CounterDomain,
	CounterReset,
	components,
} from "./domains/counter";

import "./index.css";

export async function Main(this: SeqflowFunctionContext) {
	const counter = this.app.domains.counter.get();

	const decrement = (
		<components.ChangeCounterButton delta={-1} text={"Decrement"} />
	);
	const increment = (
		<components.ChangeCounterButton delta={1} text={"Increment"} />
	);
	const reset = <components.ResetCounterButton />;
	const counterDiv = <div>{counter}</div>;
	this.renderSync(
		<>
			<div />
			<div id="counter-card">
				<div id="actions">
					{decrement}
					<div />
					{increment}
					<div />
					{reset}
				</div>
				{counterDiv}
			</div>
			<div />
		</>,
	);

	const events = this.waitEvents(
		this.domainEvent(CounterChanged),
		this.domainEvent(CounterReset),
	);
	for await (const ev of events) {
		counterDiv.textContent = `${ev.detail.counter}`;
	}
}

declare module "seqflow-js" {
	interface Domains {
		counter: CounterDomain;
	}
}
