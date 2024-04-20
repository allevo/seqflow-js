import { SeqflowFunctionContext } from "seqflow-js";

export async function ResetCounterButton(this: SeqflowFunctionContext) {
	this.renderSync(<button type="button">Reset</button>);
	const events = this.waitEvents(
		this.domEvent("click", { el: this._el as HTMLElement }),
	);
	for await (const _ of events) {
		this.app.domains.counter.reset();
	}
}
