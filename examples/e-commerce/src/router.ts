import { ComponentParam, NavigationEvent } from "seqflow-js";
import { Header } from "./components/Header";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Profile } from "./pages/profile";
import { Logout } from "./pages/logout";
import { Cart } from "./pages/cart";
import classes from "./router.module.css";
import { Category } from "./pages/category";
import { components } from "./domains/cart";
import { Checkout } from "./pages/checkout";
import { UserType } from "./domains/user";

async function NotFound({ dom: { render } }: ComponentParam) {
	render(`
<div>
	<h1>404</h1>
	<p>Not found</p>
</div>`);
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

export async function Router({ dom, event, domains }: ComponentParam) {
	dom.render(`
<div id="${classes.app}">
	<div id='header'></div>
	<main id="${classes.main}"></main>
	<div id='checkout-tooltip'></div>
</div>`);
	const user: UserType | undefined = await domains.user.getUser();
	dom.child("header", Header, {
		data: { user },
	});
	dom.child("checkout-tooltip", components.CartTooltip);

	// Default route
	dom.child(classes.main, getComponent(window.location.pathname));

	const events = event.waitEvent(event.navigationEvent());
	for await (const ev of events) {
		if (ev instanceof NavigationEvent) {
			dom.child(classes.main, getComponent(ev.path));
		} else {
			console.error("Unknown event", ev);
		}
	}
}
