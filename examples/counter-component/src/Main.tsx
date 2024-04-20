import { SeqflowFunctionContext } from "seqflow-js";

async function Button(this: SeqflowFunctionContext, data: { text: string }) {
	this.renderSync(<button type="button">{data.text}</button>);
}

export async function Main(this: SeqflowFunctionContext) {
	let counter = 0;
	const incrementButton = <Button text="Increment" />;
	const decrementButton = <Button text="Decrement" />;
	const counterDiv = <div>{counter}</div>;
	this.renderSync(
		<>
			<div>
				{decrementButton}
				{incrementButton}
			</div>
			{counterDiv}
		</>,
	);

	const events = this.waitEvents(
		this.domEvent("click", { el: this._el as HTMLElement }),
	);
	for await (const ev of events) {
		if (incrementButton.contains(ev.target)) {
			counter++;
		} else if (decrementButton.contains(ev.target)) {
			counter--;
		}

		counterDiv.textContent = `${counter}`;
	}
}
