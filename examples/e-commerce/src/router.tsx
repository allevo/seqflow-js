import { ComponentProps, Contexts, NavigationEvent } from "@seqflow/seqflow";
import { Header } from "./components/Header";
import { components } from "./domains/cart";
import type { UserType } from "./domains/user";
import { Cart } from "./pages/cart";
import { Category } from "./pages/category";
import { Checkout } from "./pages/checkout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Logout } from "./pages/logout";
import { Profile } from "./pages/profile";
import classes from "./router.module.css";

async function NotFound(_: ComponentProps<unknown>, { component }: Contexts) {
	component.renderSync(
		<div>
			<h1>404</h1>
			<p>Not found</p>
		</div>,
	);
}

function getComponent(path: string) {
	switch (true) {
		case path === "/":
			return Home;
		case path === "/profile":
			return Profile;
		case path === "/cart":
			return Cart;
		case path === "/logout":
			return Logout;
		case path === "/login":
			return Login;
		case path === "/checkout":
			return Checkout;
		case /category/.test(path):
			return Category;
		default:
			return NotFound;
	}
}

export async function Router(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const user: UserType | undefined = await app.domains.user.getUser();
	const Component = getComponent(window.location.pathname);
	component.renderSync(
		<div id={classes.app}>
			<Header user={user} className={"header"} />
			<Component key="main" className={classes.main} />
			<components.CartTooltip className={"tooltip"} />
		</div>,
	);

	const events = component.waitEvents(component.navigationEvent());
	for await (const ev of events) {
		if (ev instanceof NavigationEvent) {
			component.replaceChild("main", () => {
				const Component = getComponent(ev.path);
				return <Component key="main" className={classes.main} />;
			});
		} else {
			app.log.error({
				message: "Unknown event",
				data: { event: ev },
			});
		}
	}
}
