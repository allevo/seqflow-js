import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import type { ButtonComponent } from "../Button";

export type FormComponent = HTMLFormElement & {
	runAsync: <T>(fn: (c: Contexts) => Promise<T>) => Promise<T>;
};

export async function Form(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	if (!children) {
		app.log.error({
			message: "Form component must have children",
		});
		return;
	}

	const form = component._el as HTMLFormElement;
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
			signal: component.ac.signal,
		},
	);
	component.renderSync(children);

	const el = component._el as FormComponent;
	el.runAsync = async (fn) => {
		const button = component._el.querySelector("button[type=submit]");
		if (
			button &&
			button instanceof HTMLButtonElement &&
			"transition" in button
		) {
			const b = button as ButtonComponent;
			b.transition({
				disabled: true,
				loading: true,
				loadingText: "Loading...",
			});
			try {
				return await fn({ component, app });
			} finally {
				b.transition({
					disabled: false,
					loading: false,
				});
			}
		} else {
			return await fn({ component, app });
		}
	};
}
Form.tagName = () => "form";
