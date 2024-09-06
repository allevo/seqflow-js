import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Navbar } from ".";
import { Button } from "../Button";
import { Dropdown } from "../Dropdown";
import { Link } from "../Link";
import { Menu } from "../Menu";

async function NavbarStory(this: SeqflowFunctionContext) {
	this.renderSync(
		<Navbar className={["bg-base-100", "shadow-md"]}>
			<Button color="ghost" className="text-xl">
				SeqflowJS
			</Button>
		</Navbar>,
	);
}

// biome-ignore lint/suspicious/noExplicitAny: storybook
NavbarStory.__storybook = (Navbar as any).__storybook;

export default {
	title: "Example/Navbar",
	tags: ["autodocs"],
	component: NavbarStory,
	args: {},
};

export const Empty = {};

export const NavbarWithStartCenterEnd: StoryFn = async function (
	this: SeqflowFunctionContext,
	_: SeqflowFunctionData<unknown>,
) {
	this.renderSync(
		<Navbar className={"bg-base-100"}>
			<Navbar.Start>
				<Button color="ghost" shape="circle" className="text-xl">
					S
				</Button>
			</Navbar.Start>
			<Navbar.Center>
				<Button color="ghost" className="text-xl">
					SeqflowJS
				</Button>
			</Navbar.Center>
			<Navbar.End>
				<Button color="ghost" shape="circle" className="text-xl">
					E
				</Button>
			</Navbar.End>
		</Navbar>,
	);
};

export const NavbarResponsive: StoryFn = async function (
	this: SeqflowFunctionContext,
	_: SeqflowFunctionData<unknown>,
) {
	this.renderSync(
		<Navbar className={"bg-base-100"}>
			<Navbar.Start>
				<Dropdown label={"X"} className={["lg:hidden"]}>
					<Menu
						direction="vertical"
						size="md"
						className={["w-56", "shadow-md"]}
					>
						<Menu.Item>
							<Button className={"justify-start"} color="ghost">
								This is a button link
							</Button>
						</Menu.Item>
						<Menu.Item>
							<Link className={"justify-start"} href="#" showAsButton="ghost">
								This is a link
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Menu.SubMenu label="Parent">
								<Menu.SubMenuItem>
									<Button color="ghost">This is a button link</Button>
								</Menu.SubMenuItem>
								<Menu.SubMenuItem>
									<Link href="#" showAsButton="ghost">
										This is a link
									</Link>
								</Menu.SubMenuItem>
							</Menu.SubMenu>
						</Menu.Item>
					</Menu>
				</Dropdown>
				<Button color="ghost" shape="circle" className={["text-xl"]}>
					S
				</Button>
			</Navbar.Start>
			<Navbar.Center className={["hidden", "lg:flex"]}>
				<Menu direction="horizontal" className={["!p-0"]}>
					<Menu.Item>
						<Button color="ghost">This is a button link</Button>
					</Menu.Item>
					<Menu.Item>
						<Link href="#" showAsButton="ghost">
							This is a link
						</Link>
					</Menu.Item>
					<Menu.Item>
						<Menu.SubMenu label="Parent">
							<Menu.SubMenuItem>
								<Button color="ghost">This is a button link</Button>
							</Menu.SubMenuItem>
							<Menu.SubMenuItem>
								<Link href="#" showAsButton="ghost">
									This is a link
								</Link>
							</Menu.SubMenuItem>
						</Menu.SubMenu>
					</Menu.Item>
				</Menu>
			</Navbar.Center>
			<Navbar.End>
				<Button color="ghost" shape="circle" className="text-xl">
					E
				</Button>
			</Navbar.End>
		</Navbar>,
	);

	const events = this.waitEvents(
		this.domEvent("click", {
			el: this._el,
			fn: (e) => {
				if (e.target instanceof HTMLElement && e.target.closest("a")) {
					e.preventDefault();
					e.stopPropagation();
				}
			},
		}),
	);
	for await (const event of events) {
		console.log(event);
	}
};

export const WithDropdownAndLinkStory: StoryFn =
	async function WithDropdownAndLinkStory(this: SeqflowFunctionContext) {
		this.renderSync(
			<Navbar>
				<Navbar.Start>SeqFlowJS</Navbar.Start>
				<Navbar.Center>
					<ul style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
						<li>
							<Button color="ghost">This is a button link</Button>
						</li>
						<li>
							<Link href="#" showAsButton="ghost">
								This is a link
							</Link>
						</li>
						<li>
							<Dropdown openOn="hover" label="In Center">
								<Menu
									direction="vertical"
									size="md"
									className={["w-56", "shadow-md"]}
								>
									<Menu.Item>
										<Button color="ghost">This is a button link</Button>
									</Menu.Item>
									<Menu.Item>
										<Link href="#" showAsButton="ghost">
											This is a link
										</Link>
									</Menu.Item>
								</Menu>
							</Dropdown>
						</li>
					</ul>
				</Navbar.Center>
				<Navbar.End>
					<Dropdown openOn="hover" label="In End" align="bottom-end">
						<Menu
							direction="vertical"
							size="md"
							className={["w-56", "shadow-md"]}
							style={{ alignItems: "end" }}
						>
							<Menu.Item>
								<Button color="ghost">This is a button link</Button>
							</Menu.Item>
							<Menu.Item>
								<Link href="#" showAsButton="ghost">
									This is a link
								</Link>
							</Menu.Item>
						</Menu>
					</Dropdown>
				</Navbar.End>
			</Navbar>,
		);

		const events = this.waitEvents(
			this.domEvent("click", {
				el: this._el,
				fn: (e) => {
					if (e.target instanceof HTMLElement && e.target.closest("a")) {
						e.preventDefault();
						e.stopPropagation();
					}
				},
			}),
		);
		for await (const event of events) {
			console.log(event);
		}
	};
