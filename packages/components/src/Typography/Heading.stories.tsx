import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Heading, type HeadingProps, Prose } from ".";

async function HeadingStory(this: SeqflowFunctionContext, { title, level }: HeadingProps) {
	this.renderSync(
		<Prose wrapperClass="m-auto">
			<Heading level={level} title={title} />
		</Prose>,
	);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
HeadingStory.__storybook = (Heading as any).__storybook;

export default {
	title: "Example/Heading",
	tags: ["autodocs"],
	component: HeadingStory,
	args: {
		title: "The title of the heading",
	},
};

export const Empty = {}

export const AllHeading: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	const title = "The heading";
	this.renderSync(
		<Prose wrapperClass="m-auto">
			<Heading level={1} title={`${title} 1`} />
			<Heading level={2} title={`${title} 2`} />
			<Heading level={3} title={`${title} 3`} />
			<Heading level={4} title={`${title} 4`} />
			<p>This is a paragraph</p>
		</Prose>,
	);
};
