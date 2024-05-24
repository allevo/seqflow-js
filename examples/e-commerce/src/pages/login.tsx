import { SeqflowFunctionContext } from "seqflow-js";
import { UserType } from "../domains/user";

export async function Login(this: SeqflowFunctionContext) {
	this.renderSync(
		<div>
			<form>
				<label htmlFor="username">Username</label>
				<input
					key="username"
					id="username"
					type="text"
					name="username"
					value="johnd"
				/>
				<p key="error" className="error" />
				<button key="login-button" type="submit">
					Login
				</button>
			</form>
		</div>,
	);

	const usernameInput = this.getChild("username") as HTMLInputElement;
	const error = this.getChild("error") as HTMLParagraphElement;
	const loginButton = this.getChild("login-button") as HTMLButtonElement;
	const events = this.waitEvents(
		this.domEvent("submit", { el: this._el, preventDefault: true }),
	);
	let user: UserType | undefined;
	for await (const ev of events) {
		loginButton.disabled = true;
		const username = usernameInput.value;

		user = await this.app.domains.user.login({ username });
		if (!user) {
			error.textContent = 'User not found. Try "johnd"';
			loginButton.disabled = false;
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
