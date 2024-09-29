import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface CardProps {
	compact?: boolean;
	side?: boolean;
	shadow?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export async function Card(
	{ children, compact, side, shadow }: ComponentProps<CardProps>,
	{ component, app }: Contexts,
) {
	const classes = ["card"];
	if (compact) {
		classes.push("card-compact");
	}
	if (side) {
		classes.push("card-side");
	}
	if (shadow) {
		// shadow-sm
		// shadow-md
		// shadow-lg
		// shadow-xl
		// shadow-2xl
		classes.push(`shadow-${shadow}`);
	}
	component._el.classList.add(...classes);

	if (!children) {
		app.log.error({
			message: "Card component requires children",
		});
		return;
	}

	component.renderSync(children);
}

export async function Body(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("card-body");
	if (!children) {
		app.log.error({
			message: "Card.Body component requires children",
		});
		return;
	}

	component.renderSync(children);
}

export interface TitlePropsType {
	level: 1 | 2 | 3 | 4;
}

export async function Title(
	{ children }: ComponentProps<TitlePropsType>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("card-title");
	if (!children) {
		app.log.error({
			message: "Card.Title component requires children",
		});
		return;
	}

	component.renderSync(children);
}
Title.tagName = () => "h2";

export async function Actions(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("card-actions");
	component._el.classList.add("justify-end");

	if (!children) {
		app.log.error({
			message: "Card.Actions component requires children",
		});
		return;
	}

	component.renderSync(children);
}

Card.Body = Body;
Card.Title = Title;
Card.Actions = Actions;
Object.assign(Card, {
	Body,
	Title,
	Actions,
});
