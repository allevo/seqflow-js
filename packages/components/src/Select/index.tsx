import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface SelectPropsType {
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
	{ size, bordered, color, children }: SeqflowFunctionData<SelectPropsType>,
) {
	this._el.id = "pippo";

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

	if (!children) {
		this.app.log.error({
			message: "Select component requires children",
		});
		return;
	}

	this.renderSync(children);
}
Select.tagName = () => "select";
