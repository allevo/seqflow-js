import { expect, userEvent, within } from "@storybook/test";

import type { Contexts } from "@seqflow/seqflow";
import type { StoryFn } from "@seqflow/storybook";
import { Badge } from ".";

export default {
	title: "Example/Badge",
	tags: ["autodocs"],
	component: Badge,
	args: {
		children: "1",
	},
};

export const Empty = {};

export const AllBadge: StoryFn = async (_, { component }: Contexts) => {
	component.renderSync(
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
			}}
		>
			<div>Color</div>
			<div>
				<Badge color="neutral">neutral</Badge>
			</div>
			<div>
				<Badge color="primary">primary</Badge>
			</div>
			<div>
				<Badge color="secondary">secondary</Badge>
			</div>
			<div>
				<Badge color="accent">accent</Badge>
			</div>
			<div>
				<Badge color="ghost">ghost</Badge>
			</div>
			<div>
				<Badge color="info">info</Badge>
			</div>
			<div>
				<Badge color="success">success</Badge>
			</div>
			<div>
				<Badge color="warning">warning</Badge>
			</div>
			<div>
				<Badge color="error">error</Badge>
			</div>
			<div>
				<Badge color="outline">outline</Badge>
			</div>
		</div>,
	);
};
