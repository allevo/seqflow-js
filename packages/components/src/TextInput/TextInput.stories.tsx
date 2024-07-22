import { expect, userEvent, within } from "@storybook/test";

import { StoryFn } from "seqflow-js-storybook";
import { TextInput } from ".";

export default {
	title: "Example/TextInput",
	tags: ["autodocs"],
	component: TextInput,
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
