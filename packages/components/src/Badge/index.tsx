import type { ComponentProps, Contexts } from "@seqflow/seqflow";

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
	{ color, size, children }: ComponentProps<BadgePropsType>,
	{ component, app }: Contexts,
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
	component._el.classList.add(...classNames);

	component._el.setAttribute("aria-live", "polite");

	if (!children) {
		app.log.error({
			message: "Badge component requires children",
		});
		return;
	}

	component.renderSync(children);
}
