import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Heading, type HeadingProps, Prose } from ".";

async function HeadingStory(
	this: SeqflowFunctionContext,
	{ level, children }: SeqflowFunctionData<HeadingProps>,
) {
	this.renderSync(
		<Prose className="m-auto">
			<Heading level={level}>The title of the heading</Heading>
		</Prose>,
	);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
HeadingStory.__storybook = (Heading as any).__storybook;

export default {
	title: "Example/Heading",
	tags: ["autodocs"],
	component: HeadingStory,
	args: {},
};

export const Empty = {};

export const AllHeading: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	const title = "The heading";
	this.renderSync(
		<Prose className="m-auto">
			<Heading level={1}>{`${title} 1`}</Heading>
			<Heading level={2}>{`${title} 2`}</Heading>
			<Heading level={3}>{`${title} 3`}</Heading>
			<Heading level={4}>{`${title} 4`}</Heading>
			<p>This is a paragraph</p>
		</Prose>,
	);
};
