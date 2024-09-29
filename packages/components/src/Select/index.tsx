import type { ComponentProps, Contexts } from "@seqflow/seqflow";

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
	required?: boolean;
}

export async function Select(
	{
		size,
		bordered,
		color,
		children,
		name,
		disabled,
		required,
	}: ComponentProps<SelectPropsType>,
	{ component, app }: Contexts,
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
	component._el.classList.add(...classes);

	if (name) {
		component._el.setAttribute("name", name);
	}
	if (disabled === true) {
		component._el.setAttribute("disabled", "");
	}

	if (!children) {
		app.log.error({
			message: "Select component requires children",
		});
		return;
	}

	component.renderSync(children);

	if (required) {
		component._el.setAttribute("required", "");
	}
}
Select.tagName = () => "select";
