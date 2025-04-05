import { Button, Navbar } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { CartBadge } from "../domains/cart/components/CartBadge";
import type { UserType } from "../domains/user";
import { UserProfileBadge } from "../domains/user/components/UserProfileBadge";
import { UserLoggedEvent, UserLoggedOutEvent } from "../domains/user/events";
import classes from "./Header.module.css";
import icon from "./icon.png";

export async function Header(
	data: ComponentProps<{ user?: UserType }>,
	{ component, app }: Contexts,
) {
	component.render(
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
	component._el.classList.add(className);

	const events = component.waitEvents(
		component.domainEvent(UserLoggedEvent),
		component.domainEvent(UserLoggedOutEvent),
		component.domEvent(component._el, "click", {
			preventDefault: true,
		}),
	);

	for await (const ev of events) {
		if (component.matches(ev, UserLoggedEvent)) {
			component._el.classList.add(classes.logged);
			component._el.classList.remove(classes.unlogged);
		} else if (component.matches(ev, UserLoggedOutEvent)) {
			component._el.classList.add(classes.unlogged);
			component._el.classList.remove(classes.logged);
		} else if (component.matches(ev, "sign-in", "click")) {
			app.router.navigate("/login");
		} else if (component.matches(ev, "store-logo", "click")) {
			app.router.navigate("/");
		}
	}
}
