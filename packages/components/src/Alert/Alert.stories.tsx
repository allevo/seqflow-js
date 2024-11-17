import { expect, userEvent, within } from "@storybook/test";

import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import type { StoryFn } from "@seqflow/storybook";
import { Alert, type AlertPropsType } from ".";

async function AlertStory(
	props: ComponentProps<AlertPropsType>,
	{ component }: Contexts,
) {
	component.renderSync(<Alert {...props}>This is an alert</Alert>);
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

export const AllAlert: StoryFn = async (_, { component }: Contexts) => {
	component.renderSync(
		<>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
				}}
			>
				<div>Color</div>
				<div>
					<Alert>No color</Alert>
				</div>
				<div>
					<Alert color="info">info</Alert>
				</div>
				<div>
					<Alert color="success">success</Alert>
				</div>
				<div>
					<Alert color="warning">warning</Alert>
				</div>
				<div>
					<Alert color="error">error</Alert>
				</div>
			</div>
		</>,
	);
};
