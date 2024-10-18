import { Button, Dropdown, Link, Menu, Navbar } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
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

export async function Header(
	_: ComponentProps<unknown>,
	{ component }: Contexts,
) {
	component._el.style.backgroundColor = "#2b3035";
	const svg = getSvg(logoAsString(30, 30));
	const githubLogo = getSvg(githubLogoAsString(30, 30));
	githubLogo.style.fill = "currentColor";

	const getExamples = () => {
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

	// <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
	const svgMenu = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svgMenu.setAttribute("viewBox", "0 0 448 512");
	svgMenu.style.width = "10px";
	svgMenu.style.fill = "oklch(var(--bc) / .8)";
	const pathMenu = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path",
	);
	pathMenu.setAttribute(
		"d",
		"M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z",
	);
	svgMenu.appendChild(pathMenu);

	const b = (
		<Button shape="square" color="ghost">
			{svgMenu}
		</Button>
	);

	component.renderSync(
		<Navbar className={"shadow-md"}>
			<Navbar.Start>
				<Dropdown label={b} className={["lg:hidden", classes.submenu]}>
					<Menu
						direction="vertical"
						size="md"
						className={["w-80", "shadow-md"]}
					>
						<Menu.Item>
							<Link
								showAsButton="ghost"
								href="/getting-started"
								id="getting-started-link"
								className="justify-start"
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
							<Menu.SubMenu label="Examples">{getExamples()}</Menu.SubMenu>
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
							{getExamples()}
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
