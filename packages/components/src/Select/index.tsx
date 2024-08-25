import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface SelectPropsType {
	name?: string;
	size?: "xs" | "sm" | "md" | "lg";
	bordered?: boolean;
	disabled?: boolean;
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
	{ size, bordered, color, children, name, disabled }: SeqflowFunctionData<SelectPropsType>,
) {
	const classes = ["select"];
	if (bordered === true) {
		classes.push("select-bordered");
	}
	if (size) {
		// select-xs
		// select-sm
		// select-md
		// select-lg
		classes.push(`select-${size}`);
	}
	if (color) {
		// select-ghost
		// select-primary
		// select-secondary
		// select-accent
		// select-info
		// select-success
		// select-warning
		// select-error
		classes.push(`select-${color}`);
	}
	this._el.classList.add(...classes);

	if (name) {
		this._el.setAttribute('name', name)
	}
	if (disabled === true) {
		this._el.setAttribute('disabled', '')
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
