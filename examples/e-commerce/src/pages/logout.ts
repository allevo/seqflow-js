import { ComponentParam } from "seqflow-js";

export async function Logout({ dom, event, domains, router }: ComponentParam) {
	// blank
	dom.render("");
	await domains.user.logout();
	router.navigate("/");
}
