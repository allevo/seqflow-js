import { type SeqflowFunctionContext } from "seqflow-js";
import { Button } from "seqflow-js-components";
import classes from "./Main.module.css";

export async function Main(this: SeqflowFunctionContext) {
	let counter = 0;

	this.renderSync(
		<div className={classes.wrapper}>
			<Button key="decrement-button" label="Decrement" color="accent" />
			<div className={classes.counter} key="counter">
				0
			</div>
			<Button key="increment-button" label="Increment" color="primary" />
		</div>,
	);

	const events = this.waitEvents(
		this.domEvent("click", "increment-button"),
		this.domEvent("click", "decrement-button"),
	);
	for await (const ev of events) {
		if (this.getChild("increment-button").contains(ev.target as Node)) {
			counter++;
		} else if (this.getChild("decrement-button").contains(ev.target as Node)) {
			counter--;
		}

		this.getChild("counter").textContent = `${counter}`;
	}
}
