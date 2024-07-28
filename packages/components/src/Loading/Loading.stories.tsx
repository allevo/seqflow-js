import { expect, userEvent, within } from "@storybook/test";

import { SeqflowFunctionContext } from "seqflow-js";
import { StoryFn } from "seqflow-js-storybook";
import { Loading } from ".";

export default {
	title: "Example/Loading",
	tags: ["autodocs"],
	component: Loading,
};

export const Empty = {};

export const Types: StoryFn = async function OR(this: SeqflowFunctionContext) {
	this.renderSync(
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 5fr",
				gap: "10px",
			}}
		>
			<div>default</div>
			<Loading />
			<div>ball</div>
			<Loading type="ball" />
			<div>bars</div>
			<Loading type="bars" />
			<div>dots</div>
			<Loading type="dots" />
			<div>infinity</div>
			<Loading type="infinity" />
			<div>ring</div>
			<Loading type="ring" />
			<div>spinner</div>
			<Loading type="spinner" />
		</div>,
	);
};

export const Sizes: StoryFn = async function OR(this: SeqflowFunctionContext) {
	this.renderSync(
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 2fr 2fr 2fr 2fr",
				gap: "10px",
			}}
		>
			<div />
			<div>xs</div>
			<div>sm</div>
			<div>md</div>
			<div>lg</div>
			<div>default</div>
			<Loading size="xs" />
			<Loading size="sm" />
			<Loading size="md" />
			<Loading size="lg" />
			<div>ball</div>
			<Loading size="xs" type="ball" />
			<Loading size="sm" type="ball" />
			<Loading size="md" type="ball" />
			<Loading size="lg" type="ball" />
			<div>bars</div>
			<Loading size="xs" type="bars" />
			<Loading size="sm" type="bars" />
			<Loading size="md" type="bars" />
			<Loading size="lg" type="bars" />
			<div>dots</div>
			<Loading size="xs" type="dots" />
			<Loading size="sm" type="dots" />
			<Loading size="md" type="dots" />
			<Loading size="lg" type="dots" />
			<div>infinity</div>
			<Loading size="xs" type="infinity" />
			<Loading size="sm" type="infinity" />
			<Loading size="md" type="infinity" />
			<Loading size="lg" type="infinity" />
			<div>ring</div>
			<Loading size="xs" type="ring" />
			<Loading size="sm" type="ring" />
			<Loading size="md" type="ring" />
			<Loading size="lg" type="ring" />
			<div>spinner</div>
			<Loading size="xs" type="spinner" />
			<Loading size="sm" type="spinner" />
			<Loading size="md" type="spinner" />
			<Loading size="lg" type="spinner" />
		</div>,
	);
};
