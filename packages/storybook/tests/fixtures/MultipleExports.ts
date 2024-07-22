import { SeqflowFunctionContext } from "seqflow-js";

export interface Export1PropsType {
	name: string
}
export async function Export1(
	this: SeqflowFunctionContext,
	_: Export1PropsType,
) { }

export interface Export2PropsType {
	title: string
}
export async function Export2(
	this: SeqflowFunctionContext,
	_: Export2PropsType,
) { }
