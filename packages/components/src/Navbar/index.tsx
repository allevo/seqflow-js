import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function Navbar(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const classes = ["navbar"];
	component._el.classList.add(...classes);

	if (!children) {
		app.log.error({
			message: "Navbar component requires children",
		});
		return;
	}

	component.renderSync(children);
}

export async function NavbarStart(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const classes = ["navbar-start"];
	component._el.classList.add(...classes);

	if (!children) {
		app.log.error({
			message: "NavbarStart component requires children",
		});
		return;
	}

	component.renderSync(children);
}

export async function NavbarCenter(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const classes = ["navbar-center"];
	component._el.classList.add(...classes);

	if (!children) {
		app.log.error({
			message: "NavbarCenter component requires children",
		});
		return;
	}

	component.renderSync(children);
}

export async function NavbarEnd(
	{ children }: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const classes = ["navbar-end"];
	component._el.classList.add(...classes);

	if (!children) {
		app.log.error({
			message: "NavbarEnd component requires children",
		});
		return;
	}

	component.renderSync(children);
}

Navbar.Start = NavbarStart;
Navbar.Center = NavbarCenter;
Navbar.End = NavbarEnd;
Object.assign(Navbar, {
	Start: NavbarStart,
	Center: NavbarCenter,
	End: NavbarEnd,
});
