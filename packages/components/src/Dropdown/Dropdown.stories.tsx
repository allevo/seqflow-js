import { expect, userEvent, within } from "@storybook/test";

import type { Contexts } from "@seqflow/seqflow";
import type { StoryFn } from "@seqflow/storybook";
import { Dropdown, type DropdownPropsType } from ".";
import { Button } from "../Button";
import { Link } from "../Link";
import { Menu } from "../Menu";
import { Navbar } from "../Navbar";

async function DropdownStory(
	props: DropdownPropsType,
	{ component }: Contexts,
) {
	component._el.classList.add(...["pt-48", "pl-48"]);
	component.renderSync(
		<Dropdown {...props}>
			<Menu direction="vertical" size="md" className={["w-56", "shadow-md"]}>
				<Menu.Item>
					<Button color="ghost">This is a button link</Button>
				</Menu.Item>
				<Menu.Item>
					<Link href="#" showAsButton="ghost">
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
