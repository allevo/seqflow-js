import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Menu, MenuPropsType } from ".";

async function MenuStory(
	this: SeqflowFunctionContext,
	{ children, ...props }: SeqflowFunctionData<MenuPropsType>,
) {
	this.renderSync(
		<Menu {...props} className={"w-56"}>
			<Menu.Item>
				<a href="/#">Item 1</a>
				<a href="/#">Item 2</a>
				<a href="/#">Item 3</a>
			</Menu.Item>
		</Menu>,
	);
	const events = this.waitEvents(this.domEvent("click", { el: this._el }));
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
