import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import { Menu, MenuPropsType } from ".";

async function MenuStory(
	{ children, ...props }: ComponentProps<MenuPropsType>,
	{ component }: Contexts,
) {
	component.renderSync(
		<Menu {...props} className={"w-56"}>
			<Menu.Item>
				<a href="/#">Item 1</a>
				<a href="/#">Item 2</a>
				<a href="/#">Item 3</a>
			</Menu.Item>
		</Menu>,
	);
	const events = component.waitEvents(
		component.domEvent(component._el, "click"),
	);
	for await (const ev of events) {
	}
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
MenuStory.__storybook = (Menu as any).__storybook;

export default {
	title: "Example/Menu",
	tags: ["autodocs"],
	component: MenuStory,
	args: {},
};

export const Empty = {};
