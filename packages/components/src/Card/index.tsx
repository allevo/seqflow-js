import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

interface CardProps {
	compact?: boolean;
	side?: boolean;
	shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

async function InnerCard(
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
		classes.push(`shadow-${shadow}`);
	}
	for (const c of classes) {
		this._el.classList.add(c);
	}
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

export const Card = Object.assign(InnerCard, {
	Body,
	Title,
	Actions,
});
