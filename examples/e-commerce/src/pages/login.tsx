import type { SeqflowFunctionContext } from "seqflow-js";
import {
	Button,
	Card,
	Form,
	type FormComponent,
	FormField,
	TextInput,
	type TextInputComponent,
} from "seqflow-js-components";
import type { UserType } from "../domains/user";

export async function Login(this: SeqflowFunctionContext) {
	this.renderSync(
		<Form key="login-form">
			<Card compact className={"m-auto w-96 bg-zinc-700"} shadow="md">
				<Card.Body>
					<FormField label="Username">
						<TextInput
							withBorder
							type="text"
							key="username"
							required
							name="userame"
							initialValue="johnd"
						/>
					</FormField>
					<Button type="submit" key="login-button" color="primary">
						Login
					</Button>
				</Card.Body>
			</Card>
		</Form>,
	);

	const usernameInput = this.getChild<TextInputComponent>("username");
	const form = this.getChild<FormComponent>("login-form");
	const events = this.waitEvents(
		this.domEvent("submit", { el: form, preventDefault: true }),
	);
	let user: UserType | undefined;
	for await (const _ of events) {
		const username = usernameInput.value;
		const user = await form.runAsync(async () => {
			return await this.app.domains.user.login({ username });
		});

		if (!user) {
			usernameInput.setError("User not found. Try 'johnd'");
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
