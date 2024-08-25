import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Button } from "seqflow-js-components";

export async function ApplyDeltaButton(
	this: SeqflowFunctionContext,
	{ delta, label }: SeqflowFunctionData<{ delta: number; label: string }>,
) {
	this.renderSync(
		<Button onClick={() => this.app.domains.counter.applyDelta(delta)}>
			{label}
		</Button>,
	);
}
