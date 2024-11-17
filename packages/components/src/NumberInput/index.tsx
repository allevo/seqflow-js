import type { Contexts } from "@seqflow/seqflow";

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
	required?: boolean;
}

export async function NumberInput(
	{
		name,
		placeholder,
		withBorder,
		color,
		disabled,
		required,
	}: NumberInputPropsType,
	{ component }: Contexts,
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
	component._el.classList.add(...classNames);

	const el = component._el as HTMLInputElement;
	el.type = "number";
	el.name = name;
	el.disabled = Boolean(disabled);
	if (placeholder) {
		el.placeholder = placeholder;
	}
	if (required) {
		el.required = true;
		el.ariaRequired = "true";
	}

	const ev = component.waitEvents(component.domEvent(component._el, "input"));
	for await (const _ of ev) {
		if (el.validity.valid) {
			el.dispatchEvent(new Event("valid"));
		}
	}
}
NumberInput.tagName = () => "input";
