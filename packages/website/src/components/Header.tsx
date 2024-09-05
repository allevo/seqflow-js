import { SeqflowFunctionContext } from "seqflow-js";
import {
	Button,
	Divider,
	Dropdown,
	Link,
	Menu,
	Navbar,
} from "seqflow-js-components";
import githubLogoAsString from "../public/images/github.svg";
import logoAsString from "../public/images/logo.svg";
import classes from "./Header.module.css";

function getSvg(html: string, style: Partial<HTMLElement["style"]> = {}) {
	const div = document.createElement("div");
	div.innerHTML = html;
	const svg = div.children[0] as HTMLElement;
	if (style) {
		Object.assign(svg.style, style);
	}
	return svg;
}

export async function Header(this: SeqflowFunctionContext) {
	this._el.style.backgroundColor = "#2b3035";
	const svg = getSvg(logoAsString(30, 30));
	const githubLogo = getSvg(githubLogoAsString(30, 30));
	githubLogo.style.fill = "currentColor";

	/*
	this.renderSync(
			<Navbar className={'shadow-md'}>
				<Navbar.Start>
					<a href="/" className={classes.headerAnchor} id="seqflow-anchor">
						{svg}
						SeqFlowJS
					</a>
				</Navbar.Start>
				<Navbar.Center className={["hidden", "lg:flex"]}>
					<ul className={classes.links}>
						<li>
							<Link
								showAsButton="ghost"
								href="/getting-started"
								id="getting-started-link">
								Getting started
							</Link>
						</li>
						<li>
							<Link
								showAsButton="ghost"
								href="/why"
								id="why-link">
								Why
							</Link>
						</li>
						<li>
							<Link
								showAsButton="ghost"
								href="/api-reference"
								id="api-reference-link">
								Api Reference
							</Link>
						</li>
						<li>
							<Dropdown openOn="hover" label="Examples">
								<Menu className={['w-56', 'shadow-md']} style={{ backgroundColor: '#3a3d40' }}>
									<Menu.Item>
										<Link showAsButton="ghost" href="/examples#counter" style={{ justifyContent: 'start', textAlign: 'start' }}>Counter</Link>
									</Menu.Item>
									<Menu.Item>
										<Link showAsButton="ghost" href="/examples#counter" style={{ justifyContent: 'start', textAlign: 'start' }}>E-Commerce</Link>
									</Menu.Item>
									<Menu.Item>
										<Link showAsButton="ghost" href="/examples#counter" style={{ justifyContent: 'start', textAlign: 'start' }}>Custom Element with Shadow DOM</Link>
									</Menu.Item>
								</Menu>
							</Dropdown>
						</li>
					</ul>
				</Navbar.Center>
				<Navbar.End>
					<Link
						rel="noreferrer"
						target="_blank"
						aria-label="GitHub"
						showAsButton="ghost"
						href="https://github.com/allevo/seqflow-js"
						id="api-reference-link">
						{githubLogo}
					</Link>
				</Navbar.End>
			</Navbar>
	);
	*/

	const getItems = () => {
		return (
			<>
				<Menu.SubMenuItem>
					<Link showAsButton="ghost" href="/examples#random-quote">
						Random quote
					</Link>
				</Menu.SubMenuItem>
				<Menu.SubMenuItem>
					<Link showAsButton="ghost" href="/examples#counter">
						Counter
					</Link>
				</Menu.SubMenuItem>
				<Menu.SubMenuItem>
					<Link showAsButton="ghost" href="/examples#e-commerce">
						E-Commerce
					</Link>
				</Menu.SubMenuItem>
				<Menu.SubMenuItem>
					<Link
						showAsButton="ghost"
						href="/examples#counter-with-custom-element"
					>
						Custom Element with Shadow DOM
					</Link>
				</Menu.SubMenuItem>
			</>
		);
	};

	this.renderSync(
		<Navbar className={"shadow-md"}>
			<Navbar.Start>
				<Dropdown label={"X"} className={["lg:hidden", classes.submenu]}>
					<Menu
						direction="vertical"
						size="md"
						className={["w-80", "shadow-md"]}
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
							<Menu.SubMenu label="Examples">{getItems()}</Menu.SubMenu>
						</Menu.Item>
					</Menu>
				</Dropdown>
				<Link
					showAsButton="ghost"
					href="/"
					className={classes.headerAnchor}
					id="seqflow-anchor"
				>
					{svg}
					SeqFlowJS
				</Link>
			</Navbar.Start>
			<Navbar.Center className={["hidden", "lg:flex"]}>
				<Menu direction="horizontal" className={["!p-0"]}>
					<Menu.Item>
						<Link
							showAsButton="ghost"
							href="/getting-started"
							id="getting-started-link"
						>
							Getting started
						</Link>
					</Menu.Item>
					<Menu.Item>
						<Link showAsButton="ghost" href="/why" id="why-link">
							Why
						</Link>
					</Menu.Item>
					<Menu.Item>
						<Link
							showAsButton="ghost"
							href="/api-reference"
							id="api-reference-link"
						>
							Api Reference
						</Link>
					</Menu.Item>
					<Menu.Item>
						<Menu.SubMenu className={classes.submenu} label="Examples">
							{getItems()}
						</Menu.SubMenu>
					</Menu.Item>
				</Menu>
			</Navbar.Center>
			<Navbar.End>
				<Link
					rel="noreferrer"
					target="_blank"
					aria-label="GitHub"
					showAsButton="ghost"
					href="https://github.com/allevo/seqflow-js"
					id="api-reference-link"
				>
					{githubLogo}
				</Link>
			</Navbar.End>
		</Navbar>,
	);
}
