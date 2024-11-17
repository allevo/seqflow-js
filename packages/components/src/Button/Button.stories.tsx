import { expect, userEvent, within } from "@storybook/test";

import type { Contexts } from "@seqflow/seqflow";
import type { StoryFn } from "@seqflow/storybook";
import { Button, type ButtonComponent, type ButtonPropsType } from ".";

async function ButtonStory(props: ButtonPropsType, { component }: Contexts) {
	component.renderSync(<Button {...props}>The button text</Button>);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
ButtonStory.__storybook = (Button as any).__storybook;
ButtonStory.__storybook.props.active.control = { type: "boolean" };

export default {
	title: "Example/Button",
	tags: ["autodocs"],
	component: ButtonStory,
	args: {},
};

export const Empty = {};

export const DisableButton: StoryFn = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const buttonComponent = canvas.getByRole("button") as ButtonComponent;

		await userEvent.click(buttonComponent);
		buttonComponent.transition({
			disabled: true,
		});

		expect(buttonComponent).toHaveAttribute("disabled");

		buttonComponent.transition({
			disabled: false,
		});

		expect(buttonComponent).not.toHaveAttribute("disabled");
	},
};

export const TrasitionButton: StoryFn = {
	component: async (_, { component }: Contexts) => {
		component.renderSync(<Button>The button text</Button>);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const buttonComponent = canvas.getByRole("button") as ButtonComponent;

		await userEvent.click(buttonComponent);

		buttonComponent.transition({
			loading: true,
			loadingText: "Custom loading message...",
			disabled: true,
		});

		expect(buttonComponent).toHaveAttribute("disabled");
		expect(buttonComponent).toHaveTextContent("Custom loading message...");

		await new Promise((resolve) => setTimeout(resolve, 1000));

		buttonComponent.transition({
			loading: false,
			disabled: false,
		});

		expect(buttonComponent).not.toHaveAttribute("disabled");
		expect(buttonComponent).toHaveTextContent("The button text");
	},
};

export const AllButtons: StoryFn = async (_, { component }: Contexts) => {
	component.renderSync(
		<>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
				}}
			>
				<div />
				<div>
					<Button>Default</Button>
				</div>
				<div>
					<Button color="neutral">Neutral</Button>
				</div>
				<div>
					<Button color="primary">Primary</Button>
				</div>
				<div>
					<Button color="secondary">Secondary</Button>
				</div>
				<div>
					<Button color="accent">Accent</Button>
				</div>
				<div>
					<Button color="ghost">Ghost</Button>
				</div>
				<div>
					<Button color="link">Link</Button>
				</div>

				<div>Active</div>
				<Button active>Default</Button>
				<Button active color="neutral">
					neutral
				</Button>
				<Button active color="primary">
					primary
				</Button>
				<Button active color="secondary">
					secondary
				</Button>
				<Button active color="accent">
					accent
				</Button>
				<Button active color="ghost">
					ghost
				</Button>
				<Button active color="link">
					link
				</Button>

				<div>Disabled</div>
				<Button disabled>Default</Button>
				<Button disabled color="neutral">
					neutral
				</Button>
				<Button disabled color="primary">
					primary
				</Button>
				<Button disabled color="secondary">
					secondary
				</Button>
				<Button disabled color="accent">
					accent
				</Button>
				<Button disabled color="ghost">
					ghost
				</Button>
				<Button disabled color="link">
					link
				</Button>

				<div>Glass</div>
				<Button glass>Default</Button>
				<Button glass color="neutral">
					neutral
				</Button>
				<Button glass color="primary">
					primary
				</Button>
				<Button glass color="secondary">
					secondary
				</Button>
				<Button glass color="accent">
					accent
				</Button>
				<Button glass color="ghost">
					ghost
				</Button>
				<Button glass color="link">
					link
				</Button>
			</div>
		</>,
	);
};
