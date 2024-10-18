import { Card } from "@seqflow/components";
import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function Profile(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const user = await app.domains.user.getUser();
	if (!user) {
		app.router.navigate("/login");
		return;
	}

	component.renderSync(
		<Card compact shadow="md" className={"m-auto !w-96 bg-zinc-700"}>
			<Card.Body>
				<Card.Title level={2}>Profile</Card.Title>
				<dl>
					<dt>Username</dt>
					<dd>{user.username}</dd>
					<dt>Email</dt>
					<dd>{user.email}</dd>
				</dl>
			</Card.Body>
		</Card>,
	);
}
