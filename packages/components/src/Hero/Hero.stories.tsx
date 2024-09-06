import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Hero, type HeroPropsType } from ".";
import { Button } from "../Button";
import { Heading } from "../Typography";

async function HeroStory(
	this: SeqflowFunctionContext,
	{ children, ...props }: SeqflowFunctionData<HeroPropsType>,
) {
	this.renderSync(
		<Hero className={["bg-base-200", "min-h-screen"]}>
			<Hero.Content className="text-center">
				<div className="max-w-md">
					<Heading
						title="Hello there"
						level={1}
						className="text-5xl font-bold"
					/>
					<p className="py-6">
						Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
						excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
						a id nisi.
					</p>
					<Button color="primary">Get Started</Button>
				</div>
			</Hero.Content>
		</Hero>,
	);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
HeroStory.__storybook = (Hero as any).__storybook;

export default {
	title: "Example/Hero",
	tags: ["autodocs"],
	component: HeroStory,
	args: {},
};

export const Empty = {};
