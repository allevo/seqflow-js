import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export async function Prose(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	this._el.classList.add("prose");
	if (!children) {
		this.app.log.error({
			message: "Prose component requires children",
		});
		return
	}
	this.renderSync(children);
}

export interface HeadingProps {
	/** Title */
	title: string;
	/** Level */
	level?: 1 | 2 | 3 | 4;
}

export async function Heading(
	this: SeqflowFunctionContext,
	{ title }: HeadingProps,
) {
	this.renderSync(title);
}
Heading.tagName = (props: HeadingProps) => {
	return `h${props.level || 1}`;
};
