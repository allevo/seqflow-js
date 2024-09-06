import type { ApplicationConfiguration } from "seqflow-js";
import { UserLoggedEvent, UserLoggedOutEvent } from "./events";

const LOCALSTORAGE_USER_KEY = "user";

export interface UserType {
	id: number;
	email: string;
	username: string;
	password: string;
	name: {
		firstname: string;
		lastname: string;
	};
	phone: string;
	address: {
		geolocation: {
			lat: string;
			long: string;
		};
		city: string;
		street: string;
		number: number;
		zipcode: string;
	};
}

export class UserDomain {
	private user?: UserType;

	constructor(
		private eventTarget: EventTarget,
		private applicationConfig: Readonly<ApplicationConfiguration>,
	) {}

	async restoreUser(): Promise<UserType | undefined> {
		const str = localStorage.getItem(LOCALSTORAGE_USER_KEY);
		if (!str) {
			return undefined;
		}
		this.user = JSON.parse(str) as UserType;
		return this.user;
	}

	isLoggedIn() {
		return this.user !== undefined;
	}

	async login({
		username,
	}: { username: string }): Promise<UserType | undefined> {
		const r = await fetch(`${this.applicationConfig.api.baseUrl}/users`);
		const users = (await r.json()) as UserType[];
		this.user = users.find((u) => u.username === username);
		if (this.user) {
			localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(this.user));
			this.eventTarget.dispatchEvent(new UserLoggedEvent(this.user));
		}

		return this.user;
	}

	async logout() {
		this.user = undefined;
		localStorage.removeItem(LOCALSTORAGE_USER_KEY);

		this.eventTarget.dispatchEvent(new UserLoggedOutEvent(null));
	}

	async getUser(): Promise<UserType | undefined> {
		return this.user;
	}
}
