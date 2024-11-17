import { Button } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { UserLoggedEvent, UserLoggedOutEvent } from "../events";
import classes from "./user-profile-badge.module.css";

function getProfileUrl(user: { username: string }, size: number) {
	return `https://placehold.co/${size}?text=${user.username[0].toUpperCase()}`;
}

const size = 40;
export async function UserProfileBadge(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const user = (await app.domains.user.getUser()) || {
		username: "Guest",
	};

	const profileHeaderMenuId = classes["profile-header-menu"];

	const profileHeaderMenu = (
		<div id={profileHeaderMenuId}>
			<ol>
				<li>
					<a href="/profile">Profile</a>
				</li>
				<li>
					<a href="/logout">Logout</a>
				</li>
			</ol>
		</div>
	) as HTMLDivElement;

	component.renderSync(
		<Button color="link" className={classes.logoWrapper}>
			<img
				key="logo"
				width={size}
				height={size}
				className={classes.logo}
				src={getProfileUrl(user, size)}
				alt="Profile Avatar"
			/>
			<span className={classes["profile-header-menu-wrapper"]}>
				{profileHeaderMenu}
			</span>
		</Button>,
	);

	const profilePicture = component.getChild("logo") as HTMLImageElement;
	const events = component.waitEvents(
		component.domainEvent(UserLoggedEvent),
		component.domainEvent(UserLoggedOutEvent),
		component.domEvent(component._el, "click"),
		component.domEvent(component._el, "mouseover"),
		component.domEvent(component._el, "mouseout"),
	);
	for await (const ev of events) {
		if (ev instanceof UserLoggedEvent || ev instanceof UserLoggedOutEvent) {
			const user = (await app.domains.user.getUser()) || {
				username: "Guest",
			};
			profilePicture.src = getProfileUrl(user, size);
		} else if (ev.type === "click") {
			ev.preventDefault();

			if (ev.target instanceof HTMLAnchorElement) {
				const url = new URL(ev.target.href);
				app.router.navigate(url.pathname);
			} else if (ev.target instanceof HTMLImageElement) {
				app.router.navigate("/profile");
			}
		} else if (ev.type === "mouseover") {
			profileHeaderMenu.classList.add(classes.show);
		} else if (ev.type === "mouseout") {
			profileHeaderMenu.classList.remove(classes.show);
		}
	}
}
