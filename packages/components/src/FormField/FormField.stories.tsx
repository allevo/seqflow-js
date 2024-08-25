import { expect, userEvent, within } from "@storybook/test";

import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { FormField, type FormFieldPropsType } from ".";
import { TextInput } from "../TextInput";

async function FormFieldExample(this: SeqflowFunctionContext, { label, errorMessage }: SeqflowFunctionData<FormFieldPropsType>) {
	this.renderSync(
		<FormField id="username-label" label={label} errorMessage={errorMessage}>
			<TextInput id="username" name="username" placeholder="Insert username" />
		</FormField>,
	)
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
FormFieldExample.__storybook = (FormField as any).__storybook;

export default {
	title: "Example/FormField",
	tags: ["autodocs"],
	component: FormFieldExample,
	args: {
		label: "Username",
	},
};

export const Empty = {};

export const WithError: StoryFn = async function (this: SeqflowFunctionContext) {
	this.renderSync(
		<FormField label="Username" errorMessage="Username is required">
			<TextInput name="username" placeholder="Insert username" />
		</FormField>,
	)
};

export const SetError: StoryFn<FormFieldPropsType> = {
	component: FormFieldExample,
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const label = canvasElement.querySelector('#username-label') as HTMLLabelElement;
		const input = canvas.getByRole("textbox") as HTMLInputElement;

		await userEvent.type(input, "test");

		expect(label).not.toHaveAttribute("error");

		await userEvent.clear(input);

		expect(label).toHaveAttribute("error");
	},
};