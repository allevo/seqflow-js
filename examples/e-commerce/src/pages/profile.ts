import { ComponentParam } from "seqflow-js";

export async function Profile({ dom, router, domains }: ComponentParam) {
	const user = await domains.user.getUser();
	if (!user) {
		router.navigate("/login");
		return;
	}
	dom.render(`
<div>
	<h1>Profile</h1>
	<dl>
		<dt>Username</dt>
		<dd>${user.username}</dd>
		<dt>Email</dt>
		<dd>${user.email}</dd>
	</dl>
</div>`);
}
