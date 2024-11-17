import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function Prose(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("prose");
	if (!children) {
		app.log.error({
			message: "Prose component requires children",
		});
		return;
	}
	component.renderSync(children);
}

export interface HeadingProps {
	/** Level */
	level?: 1 | 2 | 3 | 4;
}

export async function Heading(
	{ children }: ComponentProps<HeadingProps>,
	{ component, app }: Contexts,
) {
	if (!children) {
		app.log.error({
			message: "Heading component requires children",
		});
		return;
	}

	component.renderSync(children);
}
Heading.tagName = (props: HeadingProps) => {
	return `h${props.level || 1}`;
};
