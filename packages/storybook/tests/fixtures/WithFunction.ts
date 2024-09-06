import type { SeqflowFunctionContext } from "seqflow-js";

export interface WithFunctionAsPropType {
	fn: () => void;
}

export async function WithFunctionAsProp(
	this: SeqflowFunctionContext,
	_: WithFunctionAsPropType,
) {
	
}
