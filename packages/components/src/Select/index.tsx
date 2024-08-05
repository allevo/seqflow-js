import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface SelectPropsType {
	name?: string;
	size?: "xs" | "sm" | "md" | "lg";
	bordered?: boolean;
	color?:
		| "ghost"
		| "primary"
		| "secondary"
		| "accent"
		| "info"
		| "success"
		| "warning"
		| "error";
}

export async function Select(
	this: SeqflowFunctionContext,
	{ size, bordered, color, children, name }: SeqflowFunctionData<SelectPropsType>,
) {
	const classes = ["select"];
	if (bordered === true) {
		classes.push("select-bordered");
	}
	if (size) {
		classes.push(`select-${size}`);
	}
	if (color) {
		classes.push(`select-${color}`);
	}
	for (const c of classes) {
		this._el.classList.add(c);
	}

	if (name) {
		this._el.setAttribute('name', name)
	}

	if (!children) {
		this.app.log.error({
			message: "Select component requires children",
		});
		return;
	}

	this.renderSync(children);
}
Select.tagName = () => "select";
