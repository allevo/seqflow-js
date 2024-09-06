import { SeqflowFunctionContext } from "seqflow-js";

export interface NormalPropsType {
	/** The text */
	label: string;
	/** is active? */
	active: boolean;
	/** size in pixel */
	size: number;
}

export async function Normal(
	this: SeqflowFunctionContext,
	_: NormalPropsType,
) {
	
}
