import { type SeqflowFunctionContext } from "seqflow-js";
import classes from "./Main.module.css";
import { CounterChanged } from "./domains/counter";
import { ChangeCounterButton } from "./domains/counter/components/ChangeCounterButton";

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

export async function Main(this: SeqflowFunctionContext) {
	this.renderSync(<Counter wrapperClass={classes["main-counter"]} />);
}
