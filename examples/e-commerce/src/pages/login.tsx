import {
	Button,
	Card,
	Form,
	type FormComponent,
	FormField,
	TextInput,
	type TextInputComponent,
} from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import type { UserType } from "../domains/user";

export async function Login(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component.renderSync(
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

	const usernameInput = component.getChild<TextInputComponent>("username");
	const form = component.getChild<FormComponent>("login-form");
	const events = component.waitEvents(
		component.domEvent("login-form", "submit", { preventDefault: true }),
	);
	let user: UserType | undefined;
	for await (const _ of events) {
		const username = usernameInput.value;
		const user = await form.runAsync(async () => {
			return await app.domains.user.login({ username });
		});

		if (!user) {
			usernameInput.setError("User not found. Try 'johnd'");
			continue;
		}

		break;
	}

	app.log.info({
		message: "User logged in",
		data: { user },
	});

	app.router.navigate("/");
}
