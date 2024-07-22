import { SeqflowFunctionContext } from "seqflow-js";

interface Foo {
	strings?: "neutral" | "primary" | "secondary" | "accent" | "ghost" | "link";
	numbers?: 1 | 2 | 3 | 4;
	booleans?: true | false;
}

export interface EnumOutsidePropsType {
	strings?: Foo['strings'],
	numbers?: Foo['numbers'];
	booleans?: Foo['booleans'];
}

export async function Enum(
	this: SeqflowFunctionContext,
	_: EnumOutsidePropsType,
) { }
