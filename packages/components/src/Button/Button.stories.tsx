import { expect, userEvent, within } from "@storybook/test";

import { SeqflowFunctionContext } from "seqflow-js";
import { StoryFn } from "seqflow-js-storybook";
import { Button, ButtonComponent } from ".";

export default {
	title: "Example/Button",
	tags: ["autodocs"],
	component: Button,
	args: {
		label: "Button",
	},
};

export const Empty = {};

export const DisableButton: StoryFn = {
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const buttonComponent = canvas.getByRole("button") as ButtonComponent;

		await userEvent.click(buttonComponent);
		buttonComponent.transition({
			disabled: true,
		});

		expect(buttonComponent).toHaveAttribute("disabled");

		await new Promise((resolve) => setTimeout(resolve, 1000));

		buttonComponent.transition({
			disabled: false,
		});

		expect(buttonComponent).not.toHaveAttribute("disabled");
	},
};

export const TrasitionButton: StoryFn = {
	play: async ({ canvasElement }) => {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const canvas = within(canvasElement);

		const buttonComponent = canvas.getByRole("button") as ButtonComponent;

		await userEvent.click(buttonComponent);

		buttonComponent.transition({
			loading: true,
			disabled: true,
			replaceText: "Loading...",
		});

		expect(buttonComponent).toHaveAttribute("disabled");
		expect(buttonComponent).toHaveTextContent("Loading...");

		await new Promise((resolve) => setTimeout(resolve, 1000));

		buttonComponent.transition({
			loading: false,
			disabled: false,
			replaceText: "__previous__",
		});

		expect(buttonComponent).not.toHaveAttribute("disabled");
		expect(buttonComponent).toHaveTextContent("Button");
	},
	args: {
		label: "Button",
		color: "secondary",
	},
};

export const AllButtons: StoryFn = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
				}}
			>
				<div />
				<div>
					<Button label="Default" />
				</div>
				<div>
					<Button color="neutral" label="neutral" />
				</div>
				<div>
					<Button color="primary" label="primary" />
				</div>
				<div>
					<Button color="secondary" label="secondary" />
				</div>
				<div>
					<Button color="accent" label="accent" />
				</div>
				<div>
					<Button color="ghost" label="ghost" />
				</div>
				<div>
					<Button color="link" label="link" />
				</div>

				<div>Active</div>
				<Button active={true} label="Default" />
				<Button active={true} color="neutral" label="neutral" />
				<Button active={true} color="primary" label="primary" />
				<Button active={true} color="secondary" label="secondary" />
				<Button active={true} color="accent" label="accent" />
				<Button active={true} color="ghost" label="ghost" />
				<Button active={true} color="link" label="link" />

				<div>Disabled</div>
				<Button disabled label="Default" />
				<Button disabled color="neutral" label="neutral" />
				<Button disabled color="primary" label="primary" />
				<Button disabled color="secondary" label="secondary" />
				<Button disabled color="accent" label="accent" />
				<Button disabled color="ghost" label="ghost" />
				<Button disabled color="link" label="link" />

				<div>Glass</div>
				<Button glass label="Default" />
				<Button glass color="neutral" label="neutral" />
				<Button glass color="primary" label="primary" />
				<Button glass color="secondary" label="secondary" />
				<Button glass color="accent" label="accent" />
				<Button glass color="ghost" label="ghost" />
				<Button glass color="link" label="link" />
			</div>
		</>,
	);
};
