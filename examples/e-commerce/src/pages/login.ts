import { ComponentParam } from "seqflow-js";
import { UserType } from "../domains/user";

export async function Login({ dom, event, domains }: ComponentParam) {
	dom.render(`<div>
<form>
	<label for="username">Username</label>
	<input type="text" name="username" value="johnd" />
	<p class="error"></p>
	<button type="submit">Login</button>
</form>
</div>`);

	const el = dom.querySelector<HTMLInputElement>('input[name="username"]');
	const p = dom.querySelector(".error");
	const button = dom.querySelector<HTMLButtonElement>("button");

	const events = event.waitEvent(event.domEvent("submit"));
	let user: UserType | undefined;
	for await (const _ of events) {
		button.disabled = true;
		const username = el.value;

		user = await domains.user.login({ username });
		if (!user) {
			p.textContent = 'User not found. Try "johnd"';
			button.disabled = false;
			continue;
		}
		break;
	}

	event.navigate("/");
}
