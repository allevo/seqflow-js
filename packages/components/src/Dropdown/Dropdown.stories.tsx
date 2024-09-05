import { expect, userEvent, within } from "@storybook/test";

import type { SeqflowFunctionContext } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Dropdown, type DropdownPropsType } from ".";
import { Button } from "../Button";
import { Link } from "../Link";
import { Menu } from "../Menu";
import { Navbar } from "../Navbar";

async function DropdownStory(
	this: SeqflowFunctionContext,
	props: DropdownPropsType,
) {
	this._el.classList.add(...["pt-48", "pl-48"]);
	this.renderSync(
		<Dropdown {...props}>
			<Menu direction="vertical" size="md" className={["w-56", "shadow-md"]}>
				<Menu.Item>
					<Button color="ghost">This is a button link</Button>
				</Menu.Item>
				<Menu.Item>
					<Link href="#" showAsGhostButton>
						This is a link
					</Link>
				</Menu.Item>
			</Menu>
		</Dropdown>,
	);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
DropdownStory.__storybook = (Dropdown as any).__storybook;

export default {
	title: "Example/Dropdown",
	tags: ["autodocs"],
	component: DropdownStory,
	args: {
		label: "Dropdown",
	},
};

export const Empty = {};
