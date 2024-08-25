import type { SeqflowFunctionContext } from "seqflow-js";
import { Select, type SelectPropsType } from ".";

async function SelectStory(this: SeqflowFunctionContext, props: SelectPropsType) {
	this.renderSync(
		<Select {...props}>
			<option selected>Option 1</option>
			<option>Option 2</option>
			<option>Option 3</option>
			<option disabled>Disabled option</option>
		</Select>,
	);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
SelectStory.__storybook = (Select as any).__storybook;

export default {
	title: "Example/Select",
	tags: ["autodocs"],
	component: SelectStory,
	args: {
		bordered: true,
	}
};

export const Empty = {};
