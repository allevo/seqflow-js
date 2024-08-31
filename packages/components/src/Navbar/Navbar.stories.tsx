import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Navbar } from ".";
import { Button } from "../Button";

async function NavbarStory(this: SeqflowFunctionContext) {
	this.renderSync(
		<Navbar className={"bg-base-100"}>
			<Button color="ghost" className="text-xl">SeqflowJS</Button>
		</Navbar>,
	);
}

// biome-ignore lint/suspicious/noExplicitAny: storybook
NavbarStory.__storybook = (Navbar as any).__storybook;

export default {
	title: "Example/Navbar",
	tags: ["autodocs"],
	component: NavbarStory,
	args: {
	},
};

export const Empty = {};

export const NavbarWithStartCenterEnd: StoryFn = {
	component: async function (this: SeqflowFunctionContext, _: SeqflowFunctionData<unknown>) {
		this.renderSync(
			<Navbar className={"bg-base-100"}>
				<Navbar.Start>
				<Button color="ghost" shape="circle" className="text-xl">S</Button>
				</Navbar.Start>
				<Navbar.Center>
					<Button color="ghost" className="text-xl">SeqflowJS</Button>
				</Navbar.Center>
				<Navbar.End>
					<Button color="ghost" shape="circle" className="text-xl">E</Button>
				</Navbar.End>
			</Navbar>,
		);
	},
	play: async () => {
	},
}


export const NavbarResponsive: StoryFn = {
	component: async function (this: SeqflowFunctionContext, _: SeqflowFunctionData<unknown>) {
		this.renderSync(
			<Navbar className={"bg-base-100"}>
				<Navbar.Start>
				<Button color="ghost" shape="circle" className="text-xl">S</Button>
				</Navbar.Start>
				<Navbar.Center className={'hidden lg:flex'}>
					<Button color="ghost" className="text-xl">SeqflowJS</Button>
				</Navbar.Center>
				<Navbar.End>
					<Button color="ghost" shape="circle" className="text-xl">E</Button>
				</Navbar.End>
			</Navbar>,
		);
	},
	play: async () => {
	},
}
