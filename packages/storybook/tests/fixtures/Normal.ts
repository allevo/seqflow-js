import { Contexts } from "@seqflow/seqflow";

export interface NormalPropsType {
	/** The text */
	label: string;
	/** is active? */
	active: boolean;
	/** size in pixel */
	size: number;
}

export async function Normal(
	_: NormalPropsType,
	c: Contexts,
) {
	
}
