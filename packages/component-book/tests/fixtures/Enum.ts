import { Contexts } from "@seqflow/seqflow";

export interface EnumPropsType {
	strings?: "neutral" | "primary" | "secondary" | "accent" | "ghost" | "link";
	numbers?: 1 | 2 | 3 | 4;
	booleans?: true | false;
}

export async function Enum(
	_: EnumPropsType,
	c: Contexts,
) {
	
}
