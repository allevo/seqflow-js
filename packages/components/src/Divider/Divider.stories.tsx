import type { SeqflowFunction, SeqflowFunctionContext } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Divider } from ".";

export default {
	title: "Example/Divider",
	tags: ["autodocs"],
	component: Divider,
};

export const Empty = {};

export const WithoutText: StoryFn = async function OR(
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<div className="flex w-full flex-col border-opacity-50">
			<div className="card bg-base-300 rounded-box grid h-20 place-items-center">
				content
			</div>
			<Divider />
			<div className="card bg-base-300 rounded-box grid h-20 place-items-center">
				content
			</div>
		</div>,
	);
};

export const WithText: StoryFn = async function OR(
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<div className="flex w-full flex-col border-opacity-50">
			<div className="card bg-base-300 rounded-box grid h-20 place-items-center">
				content
			</div>
			<Divider label="OR" />
			<div className="card bg-base-300 rounded-box grid h-20 place-items-center">
				content
			</div>
		</div>,
	);
};
