import { type SeqflowFunctionContext } from "seqflow-js";
import classes from "./Main.module.css";

export async function Main(this: SeqflowFunctionContext) {
	let counter = 0;
	this.renderSync(
		<div className={classes["main-counter"]}>
			<div className={classes["counter-card"]}>
				<div className={classes.buttons}>
					<button key="decrement-button" type="button">
						Decrement
					</button>
					<div className={classes.divider} />
					<button key="increment-button" type="button">
						Increment
					</button>
				</div>
				<div className={classes.counter} key="counter">
					0
				</div>
			</div>
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
