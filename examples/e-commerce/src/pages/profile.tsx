import type { SeqflowFunctionContext } from "seqflow-js";
import { Card } from "seqflow-js-components";

export async function Profile(this: SeqflowFunctionContext) {
	const user = await this.app.domains.user.getUser();
	if (!user) {
		this.app.router.navigate("/login");
		return;
	}

	this.renderSync(
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
