import { SeqflowFunctionContext } from "seqflow-js";

export async function Profile(this: SeqflowFunctionContext) {
	const user = await this.app.domains.user.getUser();
	if (!user) {
		this.app.router.navigate("/login");
		return;
	}
	this.renderSync(
		<div>
			<h1>Profile</h1>
			<dl>
				<dt>Username</dt>
				<dd>{user.username}</dd>
				<dt>Email</dt>
				<dd>{user.email}</dd>
			</dl>
		</div>,
	);
}
