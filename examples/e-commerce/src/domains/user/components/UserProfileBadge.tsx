import { SeqflowFunctionContext } from "seqflow-js";
import { UserLoggedEvent, UserLoggedOutEvent } from "../events";
import classes from "./user-profile-badge.module.css";

function getProfileUrl(user: { username: string }, size: number) {
	return `https://placehold.co/${size}?text=${user.username[0].toUpperCase()}`;
}

const size = 40;
export async function UserProfileBadge(this: SeqflowFunctionContext) {
	const user = (await this.app.domains.user.getUser()) || {
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
	);

	this.renderSync(
		<button type="button" className={classes.logoWrapper}>
			<img
				key="logo"
				width={size}
				height={size}
				className={classes.logo}
				src={getProfileUrl(user, size)}
				alt="Profile Avatar"
			/>
			<div className={classes["profile-header-menu-wrapper"]}>
				{profileHeaderMenu}
			</div>
		</button>,
	);

	const profilePicture = this.getChild("logo") as HTMLImageElement;
	const events = this.waitEvents(
		this.domainEvent(UserLoggedEvent),
		this.domainEvent(UserLoggedOutEvent),
		this.domEvent("click", { el: this._el }),
		this.domEvent("mouseover", { el: this._el }),
		this.domEvent("mouseout", { el: this._el }),
	);
	for await (const ev of events) {
		if (ev instanceof UserLoggedEvent || ev instanceof UserLoggedOutEvent) {
			const user = (await this.app.domains.user.getUser()) || {
				username: "Guest",
			};
			profilePicture.src = getProfileUrl(user, size);
		} else if (ev.type === "click") {
			ev.preventDefault();

			if (ev.target instanceof HTMLAnchorElement) {
				const url = new URL(ev.target.href);
				this.app.router.navigate(url.pathname);
			} else if (ev.target instanceof HTMLImageElement) {
				this.app.router.navigate("/profile");
			}
		} else if (ev.type === "mouseover") {
			profileHeaderMenu.classList.add(classes.show);
		} else if (ev.type === "mouseout") {
			profileHeaderMenu.classList.remove(classes.show);
		}
	}
}
