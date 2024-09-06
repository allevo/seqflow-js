import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { ButtonComponent } from "../Button";

export type FormComponent = HTMLFormElement & {
	runAsync: <T>(fn: (this: SeqflowFunctionContext) => Promise<T>) => Promise<T>;
};

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

	const el = this._el as FormComponent;
	el.runAsync = async (fn) => {
		const button = this._el.querySelector("button[type=submit]");
		if (
			button &&
			button instanceof HTMLButtonElement &&
			"transition" in button
		) {
			const b = button as ButtonComponent;
			b.transition({
				disabled: true,
				loading: true,
				replaceText: "Loading...",
			});
			try {
				return await fn.call(this);
			} finally {
				b.transition({
					disabled: false,
					loading: false,
					replaceText: "__previous__",
				});
			}
		} else {
			return await fn.call(this);
		}
	};
}
Form.tagName = () => "form";
