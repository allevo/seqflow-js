import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import "./index.css";

export type FormFieldComponent = HTMLLabelElement & {
	setError: (textError: string) => void;
	clearError: () => void;
};

export interface FormFieldPropsType {
	label: string | JSX.Element;
	hint?: string | JSX.Element;
	errorMessage?: string;
}

function generateId() {
	return `id-${Math.random().toString(36).substr(2, 9)}`;
}

export async function FormField(
	{ children, label, errorMessage, hint }: ComponentProps<FormFieldPropsType>,
	{ component, app }: Contexts,
) {
	if (!children) {
		app.log.error({
			message: "Form component must have children",
		});
		return;
	}
	if (!Array.isArray(children)) {
		app.log.error({
			message: "Form component must have children",
		});
		return;
	}
	if (!children.length) {
		app.log.error({
			message: "Form component must have children",
		});
		return;
	}
	const input = children.find(
		(child) =>
			child instanceof HTMLElement &&
			(child.tagName === "INPUT" || child.tagName === "SELECT"),
	) as HTMLInputElement | HTMLSelectElement;
	if (!input) {
		app.log.error({
			message: "Form component must have an input child",
		});
		return;
	}

	component._el.classList.add("form-control");

	const describedBy = generateId();
	const top = (
		<div className="label">
			{/* biome-ignore lint/a11y/noLabelWithoutControl: set below on input */}
			<label id={describedBy} className="label-text">
				{label}
			</label>
		</div>
	);
	input.setAttribute("aria-labelledby", describedBy);

	const hintElement = (
		<span key="hint" className="label-text-alt hint">
			{hint || ""}
		</span>
	);

	const bottom = (
		<div className="label">
			{hintElement}
			<span key="text-error" className="label-text-alt text-error" />
		</div>
	);

	component.renderSync(
		<>
			{top}
			{children}
			{bottom}
		</>,
	);

	const el = component._el as FormFieldComponent;

	const textErrorSpan = component.getChild<HTMLSpanElement>("text-error");

	el.setError = (textError: string) => {
		textErrorSpan.textContent = textError;
		el.classList.add("form-control-error");
	};
	el.clearError = () => {
		textErrorSpan.textContent = "";
		el.classList.remove("form-control-error");
	};

	if (errorMessage) {
		el.setError(errorMessage);
	}

	if (input instanceof HTMLInputElement) {
		const events = component.waitEvents(
			component.domEvent(input, "valid"),
			component.domEvent(input, "invalid"),
		);
		for await (const ev of events) {
			if (ev.type === "invalid") {
				el.setError(input.validationMessage);
			}
			if (ev.type === "valid") {
				el.clearError();
			}
		}
	}
}
FormField.tagName = () => "div";
