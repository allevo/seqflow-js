import { NavigationEvent, SeqflowFunctionContext } from "seqflow-js";
import { Header } from "./components/header";
import { components } from "./domains/cart";
import { UserType } from "./domains/user";
import { Cart } from "./pages/cart";
import { Category } from "./pages/category";
import { Checkout } from "./pages/checkout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Logout } from "./pages/logout";
import { Profile } from "./pages/profile";
import classes from "./router.module.css";

async function NotFound(this: SeqflowFunctionContext) {
	this.renderSync(
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

export async function Router(this: SeqflowFunctionContext) {
	const user: UserType | undefined = await this.app.domains.user.getUser();
	const Component = getComponent(window.location.pathname);
	this.renderSync(
		<div id={classes.app}>
			<Header user={user} wrapperClass={"header"} />
			<Component key="main" wrapperClass={classes.main} />
			<components.CartTooltip wrapperClass={"tooltip"} />
		</div>,
	);

	const events = this.waitEvents(this.navigationEvent());
	for await (const ev of events) {
		if (ev instanceof NavigationEvent) {
			this.replaceChild("main", () => {
				const Component = getComponent(ev.path);
				return <Component key="main" wrapperClass={classes.main} />;
			});
		} else {
			console.error("Unknown event", ev);
		}
	}
}
