import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface BadgePropsType {
	color?:
		| "neutral"
		| "primary"
		| "secondary"
		| "accent"
		| "ghost"
		| "info"
		| "success"
		| "warning"
		| "error"
		| "outline";
	size?: "normal" | "lg" | "md" | "sm" | "xs";
}

export async function Badge(
	this: SeqflowFunctionContext,
	{ color, size, children }: SeqflowFunctionData<BadgePropsType>,
) {
	const classNames = ["badge"];
	if (color) {
		/*
		badge-neutral
		badge-primary
		badge-secondary
		badge-accent
		badge-ghost
		badge-info
		badge-success
		badge-warning
		badge-error
		badge-outline
		*/
		classNames.push(`badge-${color}`);
	}
	if (size && size !== "normal") {
		/*
		badge-lg
		badge-md
		badge-sm
		badge-xs
		*/
		classNames.push(`badge-${size}`);
	}
	this._el.classList.add(...classNames);

	this._el.setAttribute("aria-live", "polite");

	if (!children) {
		this.app.log.error({
			message: "Badge component requires children",
		});
		return;
	}

	this.renderSync(children);
}
