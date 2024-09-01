import type { SeqflowFunctionContext } from "seqflow-js";
import { Button, Navbar } from "seqflow-js-components";
import { CartBadge } from "../domains/cart/components/CartBadge";
import type { UserType } from "../domains/user";
import { UserProfileBadge } from "../domains/user/components/UserProfileBadge";
import { UserLoggedEvent, UserLoggedOutEvent } from "../domains/user/events";
import classes from "./Header.module.css";
import icon from "./icon.png";

export async function Header(
	this: SeqflowFunctionContext,
	data: { user?: UserType },
) {
	this.renderSync(
		<Navbar className={classes.header}>
			<Navbar.Start>
				<a href="/">
					<img
						key="store-logo"
						src={icon}
						alt="icon"
						className={classes.icon}
					/>
				</a>
			</Navbar.Start>
			<Navbar.End className={"gap-4"}>
				<UserProfileBadge className={classes.userProfileBadge} />
				<Button key="sign-in" color="ghost" className={classes.signInButton}>
					Sign in
				</Button>
				<CartBadge />
			</Navbar.End>
		</Navbar>,
	);

	const user: UserType | undefined = data.user;
	const className = user ? classes.logged : classes.unlogged;
	this._el.classList.add(className);

	const events = this.waitEvents(
		this.domainEvent(UserLoggedEvent),
		this.domainEvent(UserLoggedOutEvent),
		this.domEvent("click", {
			el: this._el,
			preventDefault: true,
		}),
	);

	for await (const ev of events) {
		if (ev instanceof UserLoggedEvent) {
			this._el.classList.add(classes.logged);
			this._el.classList.remove(classes.unlogged);
		} else if (ev instanceof UserLoggedOutEvent) {
			this._el.classList.add(classes.unlogged);
			this._el.classList.remove(classes.logged);
		} else if (this.getChild("sign-in").contains(ev.target as HTMLElement)) {
			this.app.router.navigate("/login");
		} else if (this.getChild("store-logo").contains(ev.target as HTMLElement)) {
			this.app.router.navigate("/");
		}
	}
}
