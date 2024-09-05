import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export async function Hero(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	this._el.classList.add("hero");

	if (!children) {
		this.app.log.error({
			message: "Hero component must have children",
		});
		return;
	}

	this.renderSync(children);
}

export async function HeroContent(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	this._el.classList.add("hero-content");

	if (!children) {
		this.app.log.error({
			message: "HeroContent component must have children",
		});
		return;
	}

	this.renderSync(children);
}

Hero.Content = HeroContent;
Object.assign(Hero, {
	Content: HeroContent,
});
