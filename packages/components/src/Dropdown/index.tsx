import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface DropdownPropsType {
	label?: string | JSX.Element;
	openOn?: "hover" | "click";
	align?:
		| "end"
		| "top"
		| "top-end"
		| "bottom"
		| "bottom-end"
		| "left"
		| "left-end"
		| "right"
		| "right-end";
}

export async function Dropdown(
	{ label, openOn, align, children }: ComponentProps<DropdownPropsType>,
	{ component, app }: Contexts,
) {
	const classes = ["dropdown"];
	if (openOn === "hover") {
		classes.push("dropdown-hover");
	}
	if (align) {
		/*
		dropdown-end
		dropdown-top
		dropdown-bottom
		dropdown-left
		dropdown-right
		*/
		classes.push(...align.split("-").map((a) => `dropdown-${a}`));
	}
	component._el.classList.add(...classes);

	if (!children) {
		app.log.error({
			message: "Dropdown component must have children",
		});
		return;
	}

	if (Array.isArray(children)) {
		for (const child of children) {
			if (child instanceof DocumentFragment) {
				continue;
			}
			child.classList.add("dropdown-content");
			child.classList.add("z-[90]");
		}
	}

	const btn =
		typeof label === "string" ? (
			<button type="button" tabIndex={0} className="btn m-1">
				{label}
			</button>
		) : (
			label
		);

	if (btn instanceof HTMLElement) {
		// This is needed for Safari, otherwise the dropdown won't open
		// See: https://github.com/allevo/seqflow-js/issues/29
		// See: https://stackoverflow.com/questions/61652836/why-does-focus-within-not-work-in-safari
		btn.tabIndex = 0;
	}

	component.renderSync(
		<>
			{btn}
			{/*<Button color="ghost" className="rounded-btn">{label}</Button>*/}
			{children}
		</>,
	);
}
