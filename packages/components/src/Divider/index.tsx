import type { Contexts } from "@seqflow/seqflow";

export interface DividerPropsType {
	/** The text */
	label?: string;
}

export async function Divider(
	{ label }: DividerPropsType,
	{ component }: Contexts,
) {
	component._el.classList.add("divider");

	if (label) {
		component._el.textContent = label;
	}
}
