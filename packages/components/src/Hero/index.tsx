import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function Hero(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("hero");

	if (!children) {
		app.log.error({
			message: "Hero component must have children",
		});
		return;
	}

	component.renderSync(children);
}

export async function HeroContent(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("hero-content");

	if (!children) {
		app.log.error({
			message: "HeroContent component must have children",
		});
		return;
	}

	component.renderSync(children);
}

Hero.Content = HeroContent;
Object.assign(Hero, {
	Content: HeroContent,
});
