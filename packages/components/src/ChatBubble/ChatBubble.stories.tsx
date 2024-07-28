import { SeqflowFunctionContext } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { BubbleProps, ChatBubble } from ".";
import { Button } from "../Button";

export default {
	title: "Example/ChatBubble",
	tags: ["autodocs"],
	component: async function (this: SeqflowFunctionContext) {
		this.renderSync(
			<>
				<ChatBubble spot="start">
					<ChatBubble.Bubble>
						<p>It's over Anakin,I have the high ground.</p>
					</ChatBubble.Bubble>
				</ChatBubble>
				<ChatBubble spot="end">
					<ChatBubble.Bubble>
						<p>You underestimate my power!</p>
					</ChatBubble.Bubble>
				</ChatBubble>
			</>
		);
	},
	args: {},
};

export const AllColors: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	const colors: BubbleProps['color'][] = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'];
	const elements: JSX.Element[] = []
	for (const color of colors) {
		elements.push(
			<ChatBubble spot="start">
				<ChatBubble.Bubble color={color}>
					<p>{color} bubble</p>
				</ChatBubble.Bubble>
			</ChatBubble>
		)
	}

	this.renderSync(
		elements
	);
};
