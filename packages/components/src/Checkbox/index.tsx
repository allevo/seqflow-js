import type { Contexts } from "@seqflow/seqflow";

export interface CheckboxPropsType {
	color?:
		| "primary"
		| "secondary"
		| "accent"
		| "success"
		| "warning"
		| "info"
		| "error";
	size?: "lg" | "md" | "sm" | "xs";
	disabled?: boolean;
	defaultChecked?: boolean;
	name?: string;
}

export async function Checkbox(
	{ color, size, disabled, name, defaultChecked }: CheckboxPropsType,
	{ component }: Contexts,
) {
	const classNames = ["checkbox"];
	if (color) {
		// checkbox-primary
		// checkbox-secondary
		// checkbox-accent
		// checkbox-success
		// checkbox-warning
		// checkbox-info
		// checkbox-error
		classNames.push(`checkbox-${color}`);
	}
	if (size) {
		// checkbox-lg
		// checkbox-md
		// checkbox-sm
		// checkbox-xs
		classNames.push(`checkbox-${size}`);
	}
	component._el.classList.add(...classNames);

	const el = component._el as HTMLInputElement;
	el.type = "checkbox";
	if (disabled !== undefined) {
		el.disabled = disabled;
	}
	if (defaultChecked !== undefined) {
		el.defaultChecked = defaultChecked;
		el.checked = defaultChecked;
	}
	if (name !== undefined) {
		el.name = name;
	}
}
Checkbox.tagName = () => "input";
