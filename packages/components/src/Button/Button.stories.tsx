import { expect, userEvent, within } from "@storybook/test";

import { SeqflowFunctionContext } from "seqflow-js";
import { buildComponent } from "seqflow-js-storybook/render";
import { Button, ButtonComponent } from ".";

export default {
	title: "Example/Button",
	tags: ["autodocs"],
	component: Button,
	args: {
		label: "Button",
	},
};

export const DisableButton = {
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

export const TrasitionButton = {
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

export const Foo = {
	title: "Example/Button",
	tags: ["autodocs"],
	name: "foo",
	render: (ctx, args) => {
		async function WWW(this: SeqflowFunctionContext, args) {
			this.renderSync(
				<>
					<div className="flex items-center gap-2">
						<Button label="Default" />
						<Button color="neutral" label="neutral" />
						<Button color="primary" label="primary" />
						<Button color="secondary" label="secondary" />
						<Button color="accent" label="accent" />
						<Button color="ghost" label="ghost" />
						<Button color="link" label="link" />
					</div>

					<div className="flex items-center gap-2">
						<Button active={true} label="Default" />
						<Button active={true} color="neutral" label="neutral" />
						<Button active={true} color="primary" label="primary" />
						<Button active={true} color="secondary" label="secondary" />
						<Button active={true} color="accent" label="accent" />
						<Button active={true} color="ghost" label="ghost" />
						<Button active={true} color="link" label="link" />
					</div>

					<div className="flex items-center gap-2">
						<Button disabled label="Default" />
						<Button disabled color="neutral" label="neutral" />
						<Button disabled color="primary" label="primary" />
						<Button disabled color="secondary" label="secondary" />
						<Button disabled color="accent" label="accent" />
						<Button disabled color="ghost" label="ghost" />
						<Button disabled color="link" label="link" />
					</div>

					<div className="flex items-center gap-2">
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
		}

		return buildComponent(WWW, args);
	},
	args: {
		label: "FHFHFHFFHHFFHHHF",
	},
};
