import type { SeqflowFunctionContext } from "seqflow-js";

export interface NumberInputPropsType {
	name: string;
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
}

export async function NumberInput(
	this: SeqflowFunctionContext,
	{ name, placeholder, withBorder, color, disabled }: NumberInputPropsType,
) {
	const classNames = ["input"];
	if (withBorder !== false) {
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
	el.type = "number";
	el.name = name;
	el.disabled = Boolean(disabled);
	if (placeholder) {
		el.placeholder = placeholder;
	}
}
NumberInput.tagName = () => "input";
