import { Contexts } from "@seqflow/seqflow";

export interface Export1PropsType {
	name: string
}
export async function Export1(
	_: Export1PropsType,
	c: Contexts,
) { }

export interface Export2PropsType {
	title: string
}
export async function Export2(
	_: Export2PropsType,
	c: Contexts,
) { }
