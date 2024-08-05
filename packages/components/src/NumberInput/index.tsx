import { SeqflowFunctionContext } from "seqflow-js";

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
		classNames.push(`input-${color}`);
	}
	for (const c of classNames) {
		this._el.classList.add(c);
	}
	const el = this._el as HTMLInputElement;
	el.type = "number";
	el.name = name;
	el.disabled = disabled ? true : false;
	if (placeholder) {
		el.placeholder = placeholder;
	}
}

NumberInput.tagName = () => "input";
