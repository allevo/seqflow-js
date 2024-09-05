import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface MenuPropsType {
	direction?: "horizontal" | "vertical";
	size?: "xs" | "sm" | "md" | "lg";
}

export async function Menu(
	this: SeqflowFunctionContext,
	{ direction, children, size }: SeqflowFunctionData<MenuPropsType>,
) {
	this._el.classList.add(...["menu", "rounded-box"]);

	if (direction) {
		/*
		menu-horizontal
		menu-vertical
		*/
		this._el.classList.add(`menu-${direction}`);
	}
	if (size) {
		/*
		menu-xs
		menu-sm
		menu-md
		menu-lg
		*/
		this._el.classList.add(`menu-${size}`);
	}

	if (!children) {
		this.app.log.error({
			message: "Menu component must have children",
		});
		return;
	}

	this.renderSync(children);
}
Menu.tagName = () => "ul";

export async function MenuItem(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	if (!children) {
		this.app.log.error({
			message: "MenuItem component must have children",
		});
		return;
	}

	this.renderSync(children);
}
MenuItem.tagName = () => "li";

export interface SubMenuPropsType {
	label: string;
}

export async function SubMenu(
	this: SeqflowFunctionContext,
	{ label, children }: SeqflowFunctionData<SubMenuPropsType>,
) {
	this.renderSync(
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
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	if (!children) {
		this.app.log.error({
			message: "SubMenuItem component must have children",
		});
		return;
	}

	this._el.style.alignItems = "flex-start";
	this._el.style.justifyContent = "flex-start";

	this.renderSync(children);
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
