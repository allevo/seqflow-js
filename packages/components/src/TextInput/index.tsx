import { SeqflowFunctionContext } from "seqflow-js";

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
}

export async function TextInput(
	this: SeqflowFunctionContext,
	{ placeholder, withBorder, color, disabled }: TextInputPropsType,
) {
	const classNames = ["input"];
	if (withBorder !== false) {
		classNames.push("input-bordered");
	}
	if (color && color !== "normal") {
		classNames.push(`input-${color}`);
	}
	for (const c of classNames) {
		this._el.classList.add(c);
	}
	const el = this._el as HTMLInputElement;
	el.type = "text";
	el.disabled = disabled ? true : false;
	if (placeholder) {
		el.placeholder = placeholder;
	}
}
TextInput.tagName = () => "input";
