import { SeqflowFunctionContext } from "seqflow-js";
import { CartBadge } from "../domains/cart/components/CartBadge";
import { UserType } from "../domains/user";
import { UserProfileBadge } from "../domains/user/components/UserProfileBadge";
import { UserLoggedEvent, UserLoggedOutEvent } from "../domains/user/events";
import classes from "./header.module.css";
import icon from "./icon.png";

export async function Header(
	this: SeqflowFunctionContext,
	data: { user?: UserType },
) {
	const loginButton = <button type="button">Sign in</button>;
	const storeLogo = <img src={icon} alt="icon" class={classes.icon} />;

	this.renderSync(
		<header class={classes.header}>
			<a href="/">{storeLogo}</a>
			<div class={classes.emptySpace} />
			<UserProfileBadge wrapperClass={classes.displayOnLogged} />
			<div id="login" class={classes.displayOnUnlogged}>
				{loginButton}
			</div>
			<CartBadge />
		</header>,
	);

	const user: UserType | undefined = data.user;

	let className: string;
	if (user) {
		className = classes.logged;
	} else {
		className = classes.unlogged;
	}
	this._el.classList.add(className);

	const events = this.waitEvents(
		this.domainEvent(UserLoggedEvent),
		this.domainEvent(UserLoggedOutEvent),
		this.domEvent("click", {
			el: this._el,
		}),
	);

	for await (const ev of events) {
		ev.preventDefault();
		if (ev instanceof UserLoggedEvent) {
			this._el.classList.add(classes.logged);
		} else if (ev instanceof UserLoggedOutEvent) {
			this._el.classList.remove(classes.logged);
		} else if (loginButton.contains(ev.target as HTMLElement)) {
			this.app.router.navigate("/login");
		} else if (storeLogo.contains(ev.target as HTMLElement)) {
			this.app.router.navigate("/");
		}
	}
}
