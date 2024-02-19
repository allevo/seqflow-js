import { ComponentParam } from "seqflow-js";

export async function Logout({ dom, event, domains }: ComponentParam) {
	// blank
	dom.render("");
	await domains.user.logout();
	event.navigate("/");
}
