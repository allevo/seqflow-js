import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface TabsProps {
	name?: string;
	tabFullWidth?: boolean;
}

export async function Tabs(
	{ children, name, tabFullWidth }: ComponentProps<TabsProps>,
	{ component, app }: Contexts,
) {
	if (!children || children.length === 0) {
		app.log.error({
			message: "Footer component must have children",
		});
		return;
	}

	const groupName = name || `tabs-${Math.random().toString(36).substring(7)}`;

	component._el.role = "tablist";
	component._el.classList.add("tabs", "tabs-bordered");

	let tabCounter = 0;
	for (const el of children) {
		if (el instanceof HTMLInputElement) {
			if (el.type === "radio") {
				el.name = groupName;
				tabCounter++;
			}
		}
	}

	if (tabCounter === 0) {
		app.log.error({
			message: "Tabs component must have TabHeader children",
		});
		return;
	}

	if (tabFullWidth) {
		component._el.style.gridTemplateColumns = new Array(tabCounter)
			.fill("1fr")
			.join(" ");
	}

	component.renderSync(children);
}
Tabs.tagName = () => "div";

export interface TabHeaderProps {
	label: string;
	defaultChecked?: boolean;
}

export async function TabHeader(
	{ label, defaultChecked }: ComponentProps<TabHeaderProps>,
	{ component, app }: Contexts,
) {
	const input = component._el as HTMLInputElement;
	input.type = "radio";
	input.role = "tab";
	input.classList.add("tab");
	if (defaultChecked) {
		input.checked = true;
	}

	input.ariaLabel = label;
}
TabHeader.tagName = () => "input";
Tabs.TabHeader = TabHeader;

export async function TabContent(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add("tab-content");
	component._el.role = "tabpanel";

	component.renderSync(children);
}
Tabs.TabContent = TabContent;

Object.assign(Tabs, {
	TabHeader,
	TabContent,
});
