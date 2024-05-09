import { SeqflowFunctionContext } from "seqflow-js";

export async function Logout(this: SeqflowFunctionContext) {
	// blank
	this.renderSync("");
	await this.app.domains.user.logout();
	this.app.router.navigate("/");
}
