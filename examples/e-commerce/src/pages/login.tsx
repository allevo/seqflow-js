import { SeqflowFunctionContext } from "seqflow-js";
import { UserType } from "../domains/user";

export async function Login(this: SeqflowFunctionContext) {
	const el = (
		<input id="username" type="text" name="username" value="johnd" />
	) as HTMLInputElement;
	const error = <p className="error" />;
	const submit = (<button type="submit">Login</button>) as HTMLButtonElement;

	this.renderSync(
		<div>
			<form>
				<label htmlFor="username">Username</label>
				{el}
				{error}
				{submit}
			</form>
		</div>,
	);

	const events = this.waitEvents(
		this.domEvent("submit", { el: this._el, preventDefault: true }),
	);
	let user: UserType | undefined;
	for await (const ev of events) {
		submit.disabled = true;
		const username = el.value;

		user = await this.app.domains.user.login({ username });
		if (!user) {
			error.textContent = 'User not found. Try "johnd"';
			submit.disabled = false;
			continue;
		}
		break;
	}

	this.app.log.info({
		message: "User logged in",
		data: { user },
	});

	this.app.router.navigate("/");
}
