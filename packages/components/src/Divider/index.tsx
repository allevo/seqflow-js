import { SeqflowFunctionContext } from "seqflow-js";

export interface DividerPropsType {
	/** The text */
	label?: string;
}

export async function Divider(
	this: SeqflowFunctionContext,
	{ label }: DividerPropsType,
) {
	this._el.classList.add("divider");

	if (label && typeof label === "string") {
		this._el.textContent = label;
	}
}
