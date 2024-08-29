import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { FormFieldComponent } from "../FormField";

export async function Form(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	if (!children) {
		this.app.log.error({
			message: "Form component must have children",
		});
		return;
	}

	const form = this._el as HTMLFormElement;
	form.noValidate = true;

	form.addEventListener(
		"submit",
		(ev) => {
			if (!form.checkValidity()) {
				ev.preventDefault();
				ev.stopPropagation();
				ev.stopImmediatePropagation();
			}
		},
		{
			signal: this.abortController.signal,
		},
	);
	this.renderSync(children);
}
Form.tagName = () => "form";
