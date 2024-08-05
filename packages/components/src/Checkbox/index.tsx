import { SeqflowFunctionContext } from "seqflow-js";

export interface CheckboxPropsType {
	color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'error'
	size?: 'lg' | 'md' | 'sm' | 'x'
	disabled?: boolean;
	defaultChecked?: boolean;
	name?: string;
}

export async function Checkbox(
	this: SeqflowFunctionContext,
	{ color, size, disabled, name, defaultChecked }: CheckboxPropsType,
) {
	const classNames = ["checkbox"];
	if (color) {
		classNames.push(`checkbox-${color}`)
	}
	if (size) {
		classNames.push(`checkbox-${size}`)
	}
	this._el.classList.add(...classNames)

	const el = this._el as HTMLInputElement
	el.type = 'checkbox'
	if (disabled !== undefined) {
		el.disabled = disabled
	}
	if (defaultChecked !== undefined) {
		el.defaultChecked = defaultChecked
	}
	if (name !== undefined) {
		el.name = name;
	}
}
Checkbox.tagName = () => "input";
