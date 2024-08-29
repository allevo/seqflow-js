import { expect, userEvent, within } from "@storybook/test";

import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { FormField, type FormFieldComponent, type FormFieldPropsType } from ".";
import { TextInput } from "../TextInput";

async function FormFieldExample(
	this: SeqflowFunctionContext,
	props: SeqflowFunctionData<FormFieldPropsType>,
) {
	this.renderSync(
		<FormField id="username-label" {...props}>
			<TextInput
				id="username"
				name="username"
				placeholder="Insert username"
				withBorder
			/>
		</FormField>,
	);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
FormFieldExample.__storybook = (FormField as any).__storybook;

export default {
	title: "Example/FormField",
	tags: ["autodocs"],
	component: FormFieldExample,
	args: {
		label: "Username",
		hint: "Insert your username",
	},
};

export const Empty = {};

export const WithError: StoryFn = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<FormField label="Username" errorMessage="Username is required">
			<TextInput name="username" placeholder="Insert username" />
		</FormField>,
	);
};

export const SetError: StoryFn<FormFieldPropsType> = {
	component: FormFieldExample,
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const label = canvasElement.querySelector(
			"#username-label",
		) as FormFieldComponent;
		const input = canvas.getByRole("textbox") as HTMLInputElement;

		await userEvent.type(input, "test");

		expect(label).not.toHaveClass("form-control-error");

		label.setError("Username should be at least 5 characters");
		expect(label).toHaveClass("form-control-error");
		canvas.getByText("Username should be at least 5 characters");

		await new Promise((resolve) => setTimeout(resolve, 200));

		label.clearError();
		expect(label).not.toHaveClass("form-control-error");
	},
};
