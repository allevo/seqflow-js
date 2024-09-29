import { expect, userEvent, waitFor, within } from "@storybook/test";

import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import type { StoryFn } from "seqflow-js-storybook";
import { Form, type FormComponent } from ".";
import { Button } from "../Button";
import { FormField } from "../FormField";
import { NumberInput } from "../NumberInput";
import { TextInput } from "../TextInput";

async function FormExample(
	props: ComponentProps<undefined>,
	{ component }: Contexts,
) {
	component.renderSync(
		<Form>
			<FormField id="username-label" label="username">
				<TextInput
					id="username"
					name="username"
					placeholder="Insert username"
					withBorder
					required
					validationFunction={(value) => {
						if (value.length < 3) {
							return {
								errorMessage: "Username must be at least 3 characters long",
							};
						}
						return null;
					}}
				/>
			</FormField>
			<Button type="submit">Submit</Button>
		</Form>,
	);

	const events = component.waitEvents(
		component.domEvent(component._el, "submit", { preventDefault: true }),
	);
	for await (const ev of events) {
		console.log("SUBMITTED!", new FormData(ev.target as HTMLFormElement));
	}
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
FormExample.__storybook = (Form as any).__storybook;

export default {
	title: "Example/Form",
	tags: ["autodocs"],
	component: FormExample,
	args: {},
};

export const Empty = {};

async function RequiredNumberInputForm(_: unknown, { component }: Contexts) {
	component.renderSync(
		<>
			<Form>
				<FormField label={"Choose a value"}>
					<NumberInput required name="set-value" key="number" />
				</FormField>
				<Button type="submit" color="primary">
					Set value
				</Button>
			</Form>
			<span key="show-number">Empty</span>
		</>,
	);

	const events = component.waitEvents(
		component.domEvent(component._el, "submit", { preventDefault: true }),
	);
	for await (const _ of events) {
		const input = component.getChild<HTMLInputElement>("number");
		const value = input.valueAsNumber;
		const showNumber = component.getChild<HTMLSpanElement>("show-number");
		showNumber.textContent = `value: ${value}`;
	}
}

export const NumberInputStory: StoryFn = {
	component: RequiredNumberInputForm,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const submitButton = canvas.getByRole("button") as HTMLInputElement;
		const input = canvas.getByRole("spinbutton") as HTMLInputElement;
		const formControl = input.closest(".form-control") as HTMLElement;

		expect(input.validity.valid).toBe(false);
		expect(canvas.getByText("Empty")).toBeInTheDocument();
		expect(formControl).not.toHaveClass("form-control-error");

		submitButton.click();

		await waitFor(() => expect(input.validity.valid).toBe(false));
		await waitFor(() => expect(canvas.getByText("Empty")).toBeInTheDocument());
		await waitFor(() => expect(formControl).toHaveClass("form-control-error"));
		await waitFor(() => canvas.getByText(/Please fill/i));

		await userEvent.type(input, "123");
		submitButton.click();

		await waitFor(() => expect(input.validity.valid).toBe(true));
		await waitFor(() =>
			expect(canvas.getByText("value: 123")).toBeInTheDocument(),
		);
		await waitFor(() =>
			expect(formControl).not.toHaveClass("form-control-error"),
		);

		// Remove the value
		await userEvent.clear(input);
		submitButton.click();

		await waitFor(() => expect(input.validity.valid).toBe(false));
		await waitFor(() => expect(input.validity.valid).toBe(false));
		await waitFor(() => expect(formControl).toHaveClass("form-control-error"));
		await waitFor(() => canvas.getByText(/Please fill/i));
	},
};

async function RequiredTextInputForm(_: unknown, { component }: Contexts) {
	component.renderSync(
		<>
			<Form>
				<FormField label={"Choose a value"}>
					<TextInput withBorder required name="set-value" key="text" />
				</FormField>
				<Button type="submit" color="primary">
					Set value
				</Button>
			</Form>
			<span key="show-text">Empty</span>
		</>,
	);

	const events = component.waitEvents(
		component.domEvent(component._el, "submit", { preventDefault: true }),
	);
	for await (const _ of events) {
		const input = component.getChild<HTMLInputElement>("text");
		const value = input.value;
		const showText = component.getChild<HTMLSpanElement>("show-text");
		showText.textContent = `value: ${value}`;
	}
}

export const TextInputStory: StoryFn = {
	component: RequiredTextInputForm,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const submitButton = canvas.getByRole("button") as HTMLInputElement;
		const input = canvas.getByRole("textbox") as HTMLInputElement;
		const formControl = input.closest(".form-control") as HTMLElement;

		expect(input.validity.valid).toBe(false);
		expect(canvas.getByText("Empty")).toBeInTheDocument();
		expect(formControl).not.toHaveClass("form-control-error");

		submitButton.click();

		await waitFor(() => expect(input.validity.valid).toBe(false));
		await waitFor(() => expect(canvas.getByText("Empty")).toBeInTheDocument());
		await waitFor(() => expect(formControl).toHaveClass("form-control-error"));
		await waitFor(() =>
			expect(canvas.getByText(/Please fill/i)).toBeInTheDocument(),
		);

		await userEvent.type(input, "123");
		submitButton.click();

		await waitFor(() => expect(input.validity.valid).toBe(true));
		await waitFor(() =>
			expect(canvas.getByText("value: 123")).toBeInTheDocument(),
		);
		await waitFor(() =>
			expect(formControl).not.toHaveClass("form-control-error"),
		);

		// Remove the value
		await userEvent.clear(input);
		submitButton.click();

		await waitFor(() => expect(input.validity.valid).toBe(false));
		await waitFor(() => expect(input.validity.valid).toBe(false));
		await waitFor(() => expect(formControl).toHaveClass("form-control-error"));
		await waitFor(() => canvas.getByText(/Please fill/i));
	},
};

async function AsyncSubmitionForm(_: unknown, { component }: Contexts) {
	component.renderSync(
		<>
			<Form key="form">
				<FormField label={"Choose a value"}>
					<TextInput withBorder required name="set-value" key="text" />
				</FormField>
				<Button type="submit" color="primary">
					Set value
				</Button>
			</Form>
			<span key="show-text">Empty</span>
		</>,
	);

	const form = component.getChild<FormComponent>("form");

	const events = component.waitEvents(
		component.domEvent(component._el, "submit", { preventDefault: true }),
	);
	for await (const _ of events) {
		const input = component.getChild<HTMLInputElement>("text");
		const value = input.value;
		const showText = component.getChild<HTMLSpanElement>("show-text");

		// Simulate an async operation
		await form.runAsync(async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
		});

		showText.textContent = `value: ${value}`;
	}
}

export const AsyncSubmitionStory: StoryFn = {
	component: AsyncSubmitionForm,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const submitButton = canvas.getByRole("button") as HTMLInputElement;
		const input = canvas.getByRole("textbox") as HTMLInputElement;
		const formControl = input.closest(".form-control") as HTMLElement;

		await userEvent.type(input, "123");
		submitButton.click();

		await waitFor(() =>
			expect(canvas.getByText("Loading...")).toBeInTheDocument(),
		);
		await waitFor(() =>
			expect(canvas.getByText("value: 123")).toBeInTheDocument(),
		);
	},
};
