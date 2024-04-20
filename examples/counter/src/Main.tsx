import { type SeqflowFunctionContext } from "seqflow-js";

export async function Main(this: SeqflowFunctionContext) {
	const incrementButton: HTMLButtonElement = (
		<button type="button">Increment</button>
	);
	const decrementButton: HTMLButtonElement = (
		<button type="button">Decrement</button>
	);
	const counterDiv: HTMLDivElement = <div>0</div>;

	let counter = 0;
	this.renderSync(
		<>
			<div />
			<div id="counter-card">
				<div id="actions">
					{decrementButton}
					<div />
					{incrementButton}
				</div>
				{counterDiv}
			</div>
			<div />
		</>,
	);

	const events = this.waitEvents(
		this.domEvent("click", {
			el: incrementButton,
		}),
		this.domEvent("click", {
			el: decrementButton,
		}),
	);
	for await (const ev of events) {
		if (incrementButton.contains(ev.target as Node)) {
			counter++;
		} else if (decrementButton.contains(ev.target as Node)) {
			counter--;
		}

		counterDiv.textContent = `${counter}`;
	}
}
