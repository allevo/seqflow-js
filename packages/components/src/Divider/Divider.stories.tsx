import type { Contexts } from "@seqflow/seqflow";
import type { StoryFn } from "@seqflow/storybook";
import { Divider } from ".";

export default {
	title: "Example/Divider",
	tags: ["autodocs"],
	component: Divider,
};

export const Empty = {};

export const WithoutText: StoryFn = async function OR(
	_: unknown,
	{ component }: Contexts,
) {
	component.renderSync(
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
	_: unknown,
	{ component }: Contexts,
) {
	component.renderSync(
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
