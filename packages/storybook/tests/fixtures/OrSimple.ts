import { Contexts } from "@seqflow/seqflow";

export interface OrPropsType {
	/** the label */
	label: string | number | boolean;
}
export async function Or(
	_: OrPropsType,
	c: Contexts,
) { }
