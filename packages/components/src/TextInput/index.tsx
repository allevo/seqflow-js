import type { SeqflowFunctionContext } from "seqflow-js";

export type TextInputComponent = HTMLInputElement & {
	setError: (message: string) => void;
	clearError: () => void;
};

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
	type?: "text" | "password";
	required?: boolean;
	validationFunction?: (value: string) => { errorMessage: string } | null;
}

export async function TextInput(
	this: SeqflowFunctionContext,
	{
		name,
		placeholder,
		withBorder,
		color,
		disabled,
		initialValue,
		type,
		required,
		validationFunction,
	}: TextInputPropsType,
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

	const el = this._el as TextInputComponent;
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
	if (required) {
		el.required = true;
		el.ariaRequired = "true";
	}

	el.setError = (message: string) => {
		el.setCustomValidity(message);
		el.checkValidity();
	};
	el.clearError = () => {
		el.setCustomValidity("");
		el.checkValidity();

		if (el.validity.valid) {
			el.dispatchEvent(new Event("valid"));
		}
	};

	const ev = this.waitEvents(this.domEvent("input", { el: this._el }));
	for await (const _ of ev) {
		if (validationFunction) {
			const error = validationFunction(el.value);
			if (error) {
				el.setCustomValidity(error.errorMessage);
				el.checkValidity();
			} else {
				el.setCustomValidity("");
				el.checkValidity();
			}
		} else {
			el.setCustomValidity("");
			el.checkValidity();
		}

		if (el.validity.valid) {
			el.dispatchEvent(new Event("valid"));
		}
	}
}
TextInput.tagName = () => "input";
