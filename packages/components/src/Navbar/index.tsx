import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export async function Navbar(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	const classes = ["navbar"];
	this._el.classList.add(...classes);

	if (!children) {
		this.app.log.error({
			message: "Navbar component requires children",
		});
		return;
	}

	this.renderSync(children);
}

export async function NavbarStart(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	const classes = ["navbar-start"];
	this._el.classList.add(...classes);

	if (!children) {
		this.app.log.error({
			message: "NavbarStart component requires children",
		});
		return;
	}

	this.renderSync(children);
}

export async function NavbarCenter(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	const classes = ["navbar-center"];
	this._el.classList.add(...classes);

	if (!children) {
		this.app.log.error({
			message: "NavbarCenter component requires children",
		});
		return;
	}

	this.renderSync(children);
}

export async function NavbarEnd(
	this: SeqflowFunctionContext,
	{ children }: SeqflowFunctionData<unknown>,
) {
	const classes = ["navbar-end"];
	this._el.classList.add(...classes);

	if (!children) {
		this.app.log.error({
			message: "NavbarEnd component requires children",
		});
		return;
	}

	this.renderSync(children);
}

Navbar.Start = NavbarStart;
Navbar.Center = NavbarCenter;
Navbar.End = NavbarEnd;
Object.assign(Navbar, {
	Start: NavbarStart,
	Center: NavbarCenter,
	End: NavbarEnd,
});
