import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import { StoryFn } from "@seqflow/storybook";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { Tabs, TabsProps } from ".";

async function TabsExample(
	props: ComponentProps<TabsProps>,
	{ component }: Contexts,
) {
	component.renderSync(
		<Tabs {...props}>
			<Tabs.TabHeader defaultChecked label="Tab 1" />
			<Tabs.TabContent className={"p-10"}>Tab content 1</Tabs.TabContent>

			<Tabs.TabHeader label="Tab 2" />
			<Tabs.TabContent className={"p-2"}>Tab content 2</Tabs.TabContent>
		</Tabs>,
	);
}

// biome-ignore lint/suspicious/noExplicitAny: storybook
TabsExample.__storybook = (Tabs as any).__storybook;

export default {
	title: "Example/Tabs",
	tags: ["autodocs"],
	component: TabsExample,
	args: {},
};

export const Empty = {};

export const SwitchBetweenTabs: StoryFn = {
	component: TabsExample,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const firstTab = canvas.getByRole("tab", {
			name: "Tab 1",
		});
		const secondTab = canvas.getByRole("tab", {
			name: "Tab 2",
		});

		const firstContent = await canvas.findByText("Tab content 1");
		const secondContent = await canvas.findByText("Tab content 2");

		await waitFor(() => expect(firstContent).toBeVisible());
		await waitFor(() => expect(secondContent).not.toBeVisible());

		secondTab.click();

		await waitFor(() => expect(firstContent).not.toBeVisible());
		await waitFor(() => expect(secondContent).toBeVisible());

		firstTab.click();

		await waitFor(() => expect(firstContent).toBeVisible());
		await waitFor(() => expect(secondContent).not.toBeVisible());
	},
};

export const DefaultCheckedTabs: StoryFn = {
	component: async function TabsExample(
		props: ComponentProps<TabsProps>,
		{ component }: Contexts,
	) {
		component.renderSync(
			<Tabs {...props}>
				<Tabs.TabHeader label="Tab 1" />
				<Tabs.TabContent>Tab content 1</Tabs.TabContent>

				<Tabs.TabHeader defaultChecked label="Tab 2" />
				<Tabs.TabContent>Tab content 2</Tabs.TabContent>
			</Tabs>,
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const firstTab = canvas.getByRole("tab", {
			name: "Tab 1",
		});
		const secondTab = canvas.getByRole("tab", {
			name: "Tab 2",
		});

		const firstContent = await canvas.findByText("Tab content 1");
		const secondContent = await canvas.findByText("Tab content 2");

		await waitFor(() => expect(secondContent).toBeVisible());
		await waitFor(() => expect(firstContent).not.toBeVisible());
	},
};
