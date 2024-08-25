import type { SeqflowFunctionContext } from "seqflow-js";

export interface TextInputPropsType {
	placeholder?: string;
	withBorder?: boolean;
	color?:
		| "normal"
		| "primary"
		| "secondary"
		| "accent"
		| "info"
		| "success"
		| "warning"
		| "error"
		| "ghost";
	disabled?: boolean;
	initialValue?: string;
	name?: string;
	type?: 'text' | 'password';
}

export async function TextInput(
	this: SeqflowFunctionContext,
	{ name, placeholder, withBorder, color, disabled, initialValue, type }: TextInputPropsType,
) {
	const classNames = ["input"];
	if (withBorder === true) {
		classNames.push("input-bordered");
	}
	if (color && color !== "normal") {
		// input-primary
		// input-secondary
		// input-accent
		// input-info
		// input-success
		// input-warning
		// input-error
		// input-ghost
		classNames.push(`input-${color}`);
	}
	this._el.classList.add(...classNames);

	const el = this._el as HTMLInputElement;
	if (type) {
		el.type = type;
	} else {
		el.type = "text";
	}
	el.disabled = Boolean(disabled);
	if (placeholder) {
		el.placeholder = placeholder;
	}
	if (initialValue) {
		el.value = initialValue;
	}
	if (name) {
		el.name = name;
	}
}
TextInput.tagName = () => "input";
