import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Button } from "../Button";

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
	this: SeqflowFunctionContext,
	{ label, openOn, align, children }: SeqflowFunctionData<DropdownPropsType>,
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
	this._el.classList.add(...classes);

	if (!children) {
		this.app.log.error({
			message: "Dropdown component must have children",
		});
		return;
	}

	if (Array.isArray(children)) {
		for (const child of children) {
			child.classList.add("dropdown-content");
			child.classList.add("z-[90]");
		}
	}

	this.renderSync(
		<>
			<div tabIndex={0} role="button" className="btn m-1">
				{label}
			</div>
			{/*<Button color="ghost" className="rounded-btn">{label}</Button>*/}
			{children}
		</>,
	);
}
