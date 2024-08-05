import { expect, userEvent, within } from "@storybook/test";

import { SeqflowFunctionContext } from "seqflow-js";
import { StoryFn } from "seqflow-js-storybook";
import { Select } from ".";

export default {
	title: "Example/Select",
	tags: ["autodocs"],
	component: async function (this: SeqflowFunctionContext) {
		this.renderSync(
			<Select>
				<option selected>Option 1</option>
				<option>Option 2</option>
				<option>Option 3</option>
				<option disabled>Disabled option</option>
			</Select>,
		);
	},
};

export const Empty = {};
