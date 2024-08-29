import type { SeqflowFunctionContext } from "seqflow-js";
import { CartBadge } from "../domains/cart/components/CartBadge";
import type { UserType } from "../domains/user";
import { UserProfileBadge } from "../domains/user/components/UserProfileBadge";
import { UserLoggedEvent, UserLoggedOutEvent } from "../domains/user/events";
import classes from "./header.module.css";
import icon from "./icon.png";

export async function Header(
	this: SeqflowFunctionContext,
	data: { user?: UserType },
) {
	this.renderSync(
		<header className={classes.header}>
			<a href="/">
				<img key="store-logo" src={icon} alt="icon" className={classes.icon} />
			</a>
			<div className={classes.emptySpace} />
			<UserProfileBadge className={classes.displayOnLogged} />
			<div id="login" className={classes.displayOnUnlogged}>
				<button key="sign-in" type="button">
					Sign in
				</button>
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
		} else if (this.getChild("sign-in").contains(ev.target as HTMLElement)) {
			this.app.router.navigate("/login");
		} else if (this.getChild("store-logo").contains(ev.target as HTMLElement)) {
			this.app.router.navigate("/");
		}
	}
}
