import { ComponentParam } from "seqflow-js";
import { CartBadge } from "../domains/cart/components/CartBadge";
import { UserType } from "../domains/user";
import { UserProfileBadge } from "../domains/user/components/UserProfileBadge";
import { UserLoggedEvent, UserLoggedOutEvent } from "../domains/user/events";
import classes from "./header.module.css";
import icon from "./icon.png";

export async function Header({
	dom,
	event,
	data,
}: ComponentParam<{ user?: UserType }>) {
	dom.render(`
<header>
	<div class="${classes.topHeader}">
		<a href="/"><img src="${icon}" alt="icon" class="${classes.icon}"></a>
		<div class="${classes.emptySpace}"></div>
		<div id="userProfileBadge" class="${classes.displayOnLogged}"></div>
		<div id="login" class="${classes.displayOnUnlogged}">
			<button id="login-button">Sign in</button>
		</div>
		<div id="cartBadge"></div>
	</div>
</header>
`);
	dom.child("userProfileBadge", UserProfileBadge);
	dom.child("cartBadge", CartBadge);

	const user: UserType | undefined = data.user;

	const header = dom.querySelector<HTMLHeadElement>("header");
	let className: string;
	if (user) {
		className = classes.logged;
	} else {
		className = classes.unlogged;
	}
	header.classList.add(className);

	const loginButton = dom.querySelector<HTMLButtonElement>("#login-button");
	const storeLogo = dom.querySelector<HTMLImageElement>(`.${classes.icon}`);
	const events = event.waitEvent(
		event.domainEvent(UserLoggedEvent),
		event.domainEvent(UserLoggedOutEvent),
		event.domEvent("click"),
	);

	for await (const ev of events) {
		if (ev instanceof UserLoggedEvent) {
			header.classList.add(classes.logged);
		} else if (ev instanceof UserLoggedOutEvent) {
			header.classList.remove(classes.logged);
		} else if (ev.target === loginButton) {
			event.navigate("/login");
		} else if (ev.target === storeLogo) {
			event.navigate("/");
		} else {
			console.log(ev);
			console.error("Unknown event", ev);
		}
	}
}
