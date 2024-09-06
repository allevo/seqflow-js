import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
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
	this: SeqflowFunctionContext,
	{
		children,
		label,
		errorMessage,
		hint,
	}: SeqflowFunctionData<FormFieldPropsType>,
) {
	if (!children) {
		this.app.log.error({
			message: "Form component must have children",
		});
		return;
	}
	if (!Array.isArray(children)) {
		this.app.log.error({
			message: "Form component must have children",
		});
		return;
	}
	if (!children.length) {
		this.app.log.error({
			message: "Form component must have children",
		});
		return;
	}
	const input = children.find(
		(child) => child.tagName === "INPUT" || child.tagName === "SELECT",
	);
	if (!input) {
		this.app.log.error({
			message: "Form component must have an input child",
		});
		return;
	}

	this._el.classList.add("form-control");

	const describedBy = generateId();
	const top = (
		<div className="label">
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

	this.renderSync(
		<>
			{top}
			{children}
			{bottom}
		</>,
	);

	const el = this._el as FormFieldComponent;

	const textErrorSpan = this.getChild<HTMLSpanElement>("text-error");

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
		const events = this.waitEvents(
			this.domEvent("valid", { el: input }),
			this.domEvent("invalid", { el: input }),
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
