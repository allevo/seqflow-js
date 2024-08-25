import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface FormFieldPropsType {
	label: string | JSX.Element;
	errorMessage?: string | JSX.Element;
}

export async function FormField(
	this: SeqflowFunctionContext,
	{
		children,
		label,
		errorMessage,
	}: SeqflowFunctionData<FormFieldPropsType>,
) {
	if (!children) {
		this.app.log.error({
			message: "Form component must have children",
		})
		return;
	}
	if (!Array.isArray(children)) {
		this.app.log.error({
			message: "Form component must have children",
		})
		return
	}
	if (!children.length) {
		this.app.log.error({
			message: "Form component must have children",
		})
		return
	}
	const input = children.find((child) => child.tagName === "INPUT" || child.tagName === "SELECT");
	if (!input) {
		this.app.log.error({
			message: "Form component must have an input child",
		})
		return
	}

	if (typeof label === 'string') {
		this._el.setAttribute('aria-label', label);
	}

	this._el.classList.add("form-control");

	let top: JSX.Element | string = '';
	if (label) {
		top = (
			<div className="label">
				<span className="label-text">{label}</span>
			</div>
		)
	}

	this.renderSync(
		<>
			{top}
			{children}
			<div className="label">
				{ /* "text-red-500" is bad here. We should put in configuration */}
				<span className="label-text-alt text-error">{errorMessage ?? ''}</span>
			</div>
		</>
	);
}
FormField.tagName = () => "label";
