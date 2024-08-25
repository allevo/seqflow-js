import { SeqflowFunctionContext } from "seqflow-js";

export interface OrPropsType {
	/** the label */
	label: string | number | boolean;
}
export async function Or(
	this: SeqflowFunctionContext,
	_: OrPropsType,
) { }
