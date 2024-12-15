import { Contexts } from "@seqflow/seqflow";

export interface SimpleEnumPropsType {
	strings?: "neutral" | "primary" | "secondary" | "accent" | "ghost" | "link";
}

export async function SimpleEnum(
	_: SimpleEnumPropsType,
	c: Contexts,
) {
	
}
