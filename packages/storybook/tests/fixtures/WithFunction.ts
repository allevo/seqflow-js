import type { Contexts } from "@seqflow/seqflow";

export interface WithFunctionAsPropType {
	fn: () => void;
}

export async function WithFunctionAsProp(
	_: WithFunctionAsPropType,
	c: Contexts,
) {
	
}
