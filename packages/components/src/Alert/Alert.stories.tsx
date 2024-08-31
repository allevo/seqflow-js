import { expect, userEvent, within } from "@storybook/test";

import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Alert, type AlertPropsType } from ".";

async function AlertStory(this: SeqflowFunctionContext, props: SeqflowFunctionData<AlertPropsType>) {
	this.renderSync(
		<Alert {...props}>This is an alert</Alert>,
	);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
AlertStory.__storybook = (Alert as any).__storybook;

export default {
	title: "Example/Alert",
	tags: ["autodocs"],
	component: AlertStory,
	args: {
		children: "This is an alert",
	},
};

export const Empty = {};

export const AllAlert: StoryFn = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
				}}
			>
				<div>Color</div>
				<div><Alert>No color</Alert></div>
				<div><Alert color="info">info</Alert></div>
				<div><Alert color="success">success</Alert></div>
				<div><Alert color="warning">warning</Alert></div>
				<div><Alert color="error">error</Alert></div>
			</div>
		</>,
	);
};
