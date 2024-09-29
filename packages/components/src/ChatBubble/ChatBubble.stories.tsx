import type { Contexts } from "@seqflow/seqflow";
import type { StoryFn } from "seqflow-js-storybook";
import { type BubbleProps, ChatBubble, type ChatBubbleProps } from ".";

async function ChatBubbleStory(
	props: ChatBubbleProps,
	{ component }: Contexts,
) {
	component.renderSync(
		<>
			<ChatBubble {...props}>
				<ChatBubble.Bubble>
					<p>It's over Anakin,I have the high ground.</p>
				</ChatBubble.Bubble>
			</ChatBubble>
			<ChatBubble {...props} spot="end">
				<ChatBubble.Bubble>
					<p>You underestimate my power!</p>
				</ChatBubble.Bubble>
			</ChatBubble>
		</>,
	);
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
ChatBubbleStory.__storybook = (ChatBubble as any).__storybook;

export default {
	title: "Example/ChatBubble",
	tags: ["autodocs"],
	component: ChatBubbleStory,
	args: {
		spot: "start",
	},
};

export const Empty = {};

export const AllColors: StoryFn<object> = async (
	_,
	{ component }: Contexts,
) => {
	const colors: BubbleProps["color"][] = [
		"primary",
		"secondary",
		"accent",
		"info",
		"success",
		"warning",
		"error",
	];
	const elements: JSX.Element[] = [];
	for (const color of colors) {
		elements.push(
			<ChatBubble spot="start">
				<ChatBubble.Bubble color={color}>
					<p>{color} bubble</p>
				</ChatBubble.Bubble>
			</ChatBubble>,
		);
	}

	component.renderSync(elements);
};
