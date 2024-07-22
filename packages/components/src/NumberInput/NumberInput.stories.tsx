import { expect, userEvent, within } from "@storybook/test";

import { NumberInput } from ".";

export default {
	title: "Example/NumberInput",
	tags: ["autodocs"],
	component: NumberInput,
};

export const Typing = {
	component: NumberInput,
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const input = canvas.getByPlaceholderText("");

		await userEvent.type(input, "3");

		expect(input).toHaveValue("3");
	},
};
