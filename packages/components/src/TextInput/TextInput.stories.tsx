import { expect, userEvent, waitFor, within } from "@storybook/test";

import type { StoryFn } from "seqflow-js-storybook";
import { TextInput, type TextInputComponent } from ".";

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

export const SetError: StoryFn<unknown> = {
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const input = canvas.getByRole("textbox") as TextInputComponent;
		await waitFor(() => expect(input.validity.valid).toBe(true));

		input.setError("An error message");
		expect(input.validity.valid).toBe(false);
		expect(input.validity.customError).toBe(true);
		expect(input.validationMessage).toBe("An error message");

		input.clearError();
		expect(input.validity.valid).toBe(true);
	},
};
