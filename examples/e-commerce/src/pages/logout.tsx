import { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function Logout(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	// blank
	component.renderSync("");
	await app.domains.user.logout();
	app.router.navigate("/");
}
