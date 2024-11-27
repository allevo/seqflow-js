import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface MenuPropsType {
	direction?: "horizontal" | "vertical";
	size?: "xs" | "sm" | "md" | "lg";
}

export async function Menu(
	{ direction, children, size }: ComponentProps<MenuPropsType>,
	{ component, app }: Contexts,
) {
	component._el.classList.add(...["menu", "rounded-box"]);
	component._el.tabIndex = 0;

	if (direction) {
		/*
		menu-horizontal
		menu-vertical
		*/
		component._el.classList.add(`menu-${direction}`);
	}
	if (size) {
		/*
		menu-xs
		menu-sm
		menu-md
		menu-lg
		*/
		component._el.classList.add(`menu-${size}`);
	}

	if (!children) {
		app.log.error({
			message: "Menu component must have children",
		});
		return;
	}

	component.renderSync(children);
}
Menu.tagName = () => "ul";

export async function MenuItem(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	if (!children) {
		app.log.error({
			message: "MenuItem component must have children",
		});
		return;
	}

	component.renderSync(children);
}
MenuItem.tagName = () => "li";

export interface SubMenuPropsType {
	label: string;
}

export async function SubMenu(
	{ label, children }: ComponentProps<SubMenuPropsType>,
	{ component }: Contexts,
) {
	component.renderSync(
		<>
			<summary
				className={["btn", "btn-ghost"]}
				style="align-content: center; justify-content: flex-start;"
			>
				<div>{label}</div>
			</summary>
			<ul className={["p-2", "z-[90]"]}>{children}</ul>
		</>,
	);
}
SubMenu.tagName = () => "details";
export async function SubMenuItem(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	if (!children) {
		app.log.error({
			message: "SubMenuItem component must have children",
		});
		return;
	}

	component._el.style.alignItems = "flex-start";
	component._el.style.justifyContent = "flex-start";

	component.renderSync(children);
}
SubMenuItem.tagName = () => "li";

Menu.Item = MenuItem;
Menu.SubMenu = SubMenu;
Menu.SubMenuItem = SubMenuItem;
Object.assign(Menu, {
	Item: MenuItem,
	SubMenu,
	SubMenuItem,
});
