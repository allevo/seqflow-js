import { expect, userEvent, within } from "@storybook/test";

import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Form } from ".";
import { Button } from "../Button";
import { FormField } from "../FormField";
import { TextInput } from "../TextInput";

async function FormExample(
	this: SeqflowFunctionContext,
	props: SeqflowFunctionData<undefined>,
) {
	this.renderSync(
		<Form>
			<FormField id="username-label" label="username">
				<TextInput
					id="username"
					name="username"
					placeholder="Insert username"
					withBorder
					required
					validationFunction={(value) => {
						if (value.length < 3) {
							return {
								errorMessage: "Username must be at least 3 characters long",
							};
						}
						return null;
					}}
				/>
			</FormField>
			<Button type="submit">Submit</Button>
		</Form>,
	);

	const events = this.waitEvents(
		this.domEvent("submit", { el: this._el, preventDefault: true }),
	);
	for await (const ev of events) {
		console.log("SUBMITTED!", new FormData(ev.target as HTMLFormElement));
	}
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
FormExample.__storybook = (Form as any).__storybook;

export default {
	title: "Example/Form",
	tags: ["autodocs"],
	component: FormExample,
	args: {},
};

export const Empty = {};
