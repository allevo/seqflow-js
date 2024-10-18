import { expect, userEvent, within } from "@storybook/test";

import type { StoryFn } from "@seqflow/storybook";
import { NumberInput } from ".";

export default {
	title: "Example/NumberInput",
	tags: ["autodocs"],
	component: NumberInput,
	args: {
		placeholder: "Type a number",
		name: "number",
		withBorder: true,
		color: "normal",
	},
};

export const Typing: StoryFn<object> = {
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const input = canvas.getByRole("spinbutton");

		await userEvent.type(input, "3");

		expect(input).toHaveValue(3);
	},
};
