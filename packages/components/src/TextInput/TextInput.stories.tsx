import { expect, userEvent, within } from "@storybook/test";

import type { StoryFn } from "seqflow-js-storybook";
import { TextInput } from ".";

export default {
	title: "Example/TextInput",
	tags: ["autodocs"],
	component: TextInput,
	args: {
		withBorder: true,
		placeholder: "a placeholder",
	},
};

export const Typing: StoryFn<unknown> = {
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const input = canvas.getByRole("textbox");

		await userEvent.type(input, "Hello, World!");

		expect(input).toHaveValue("Hello, World!");
	},
};
