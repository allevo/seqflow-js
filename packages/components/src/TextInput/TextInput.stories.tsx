import { expect, userEvent, waitFor, within } from "@storybook/test";

import type { SeqflowFunctionContext } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { TextInput, type TextInputComponent } from ".";
import { FormField, type FormFieldComponent } from "../FormField";

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

export const SetErrorWithFormField: StoryFn<unknown> = {
	component: async function (this: SeqflowFunctionContext) {
		this.renderSync(
			<FormField label="username">
				<TextInput
					withBorder
					type="text"
					required
					name="userame"
					initialValue="johnd"
				/>
			</FormField>,
		);
	},
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const formField = canvasElement.querySelector(
			".form-control",
		) as FormFieldComponent;
		const input = canvas.getByRole("textbox") as TextInputComponent;
		await waitFor(() => expect(input.validity.valid).toBe(true));

		input.setError("An error message");
		expect(input.validity.valid).toBe(false);
		expect(input.validity.customError).toBe(true);
		expect(input.validationMessage).toBe("An error message");
		await waitFor(() => expect(formField).toHaveClass("form-control-error"));

		// If no validationFunction is provided,
		// the previous custom error should be cleared
		await userEvent.type(input, "Hello, World!");

		await waitFor(() => expect(input.validity.valid).toBe(true));
		await waitFor(() =>
			expect(formField).not.toHaveClass("form-control-error"),
		);
	},
};
