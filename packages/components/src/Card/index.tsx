import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface CardProps {
	compact?: boolean;
	side?: boolean;
	shadow?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export async function Card(
	this: SeqflowFunctionContext,
	{ children, compact, side, shadow }: SeqflowFunctionData<CardProps>,
) {
	const classes = ["card", "bg-base-100"];
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
	this._el.classList.add(...classes);

	if (!children) {
		this.app.log.error({
			message: "Card component requires children",
		});
		return;
	}

	this.renderSync(children);
}

export async function Body(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	this._el.classList.add("card-body");
	if (!children) {
		this.app.log.error({
			message: "Card.Body component requires children",
		});
		return;
	}

	this.renderSync(children);
}

export interface TitlePropsType {
	level: 1 | 2 | 3 | 4;
}

export async function Title(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<TitlePropsType>,
) {
	this._el.classList.add("card-title");
	if (!children) {
		this.app.log.error({
			message: "Card.Title component requires children",
		});
		return;
	}

	this.renderSync(children);
}
Title.tagName = () => "h2";

export async function Actions(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	this._el.classList.add("card-actions");
	this._el.classList.add("justify-end");

	if (!children) {
		this.app.log.error({
			message: "Card.Actions component requires children",
		});
		return;
	}

	this.renderSync(children);
}

Card.Body = Body;
Card.Title = Title;
Card.Actions = Actions;
Object.assign(Card, {
	Body,
	Title,
	Actions,
});