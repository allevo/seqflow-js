import { SeqflowFunctionContext } from "seqflow-js";

export async function ChangeCounterButton(
	this: SeqflowFunctionContext,
	data: { delta: number; text: string },
) {
	this.renderSync(
		<button key="button" type="button">
			{data.text}
		</button>,
	);
	const events = this.waitEvents(this.domEvent("click", "button"));
	for await (const _ of events) {
		this.app.domains.counter.applyDelta(data.delta);
	}
}
