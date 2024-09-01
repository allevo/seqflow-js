import { SeqflowFunctionContext } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Checkbox } from ".";

export default {
	title: "Example/Checkbox",
	tags: ["autodocs"],
	component: Checkbox,
};

export const Empty = {};

export const AllColors: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<div>
			<Checkbox />
			<Checkbox color="primary" />
			<Checkbox color="secondary" />
			<Checkbox color="accent" />
			<Checkbox color="success" />
			<Checkbox color="info" />
			<Checkbox color="warning" />
			<Checkbox color="error" />
		</div>,
	);
};

export const AllSizes: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<div>
			<Checkbox />
			<Checkbox size="xs" />
			<Checkbox size="sm" />
			<Checkbox size="md" />
			<Checkbox size="lg" />
		</div>,
	);
};
