import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Heading, Prose, HeadingProps } from ".";

export default {
	title: "Example/Heading",
	tags: ["autodocs"],
	component: Heading,
	args: {
		title: "The title of the heading",
	},
};

export const Empty: StoryFn<HeadingProps> = async function HeadingStory(
	this: SeqflowFunctionContext,
	{ title, level }
) {
	this.renderSync(
		<Prose wrapperClass="m-auto">
			<Heading level={level} title={title} />
		</Prose>
	);
};


export const AllHeading: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	const title = 'The heading'
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
