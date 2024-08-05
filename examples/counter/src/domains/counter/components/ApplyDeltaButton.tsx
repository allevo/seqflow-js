import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Button } from "seqflow-js-components";

export async function ApplyDeltaButton(
	this: SeqflowFunctionContext,
	{ delta, label }: SeqflowFunctionData<{ delta: number; label: string }>,
) {
	this.renderSync(
		<Button
			label={label}
			onClick={() => this.app.domains.counter.applyDelta(delta)}
		/>,
	);
}
