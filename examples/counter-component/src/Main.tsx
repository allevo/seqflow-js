import { type SeqflowFunctionContext } from "seqflow-js";
import classes from "./Main.module.css";

export async function Counter(
	this: SeqflowFunctionContext,
	data: { initialCounter: number },
) {
	this._el.classList.add(classes["counter-card"]);

	let counter = data.initialCounter;
	this.renderSync(
		<>
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
				{counter}
			</div>
		</>,
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

export async function Main(this: SeqflowFunctionContext) {
	this.renderSync(
		<Counter initialCounter={0} wrapperClass={classes["main-counter"]} />,
	);
}
