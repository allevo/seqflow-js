import { ComponentParam } from "seqflow-js";
import { Header } from "./components/Header";
import { ApiReference } from "./pages/ApiReference";
import { GettingStarted } from "./pages/GettingStarted";
import { Home } from "./pages/Home";
import { Why } from "./pages/Why";

export async function Main({ dom, event, router }: ComponentParam) {
	dom.render(`
<header id="nav"></header>
<main id="main" class="flex-grow-1 overflow-y-auto"></main>
`);
	dom.child("nav", Header);

	const events = event.waitEvent(event.navigationEvent());
	while (true) {
		const path = router.segments.pop();
		switch (path) {
			case "getting-started":
				console.log("PPPPPPP ---- ");
				dom.child("main", GettingStarted);
				break;
			case "why":
				dom.child("main", Why);
				break;
			case "api-reference":
				dom.child("main", ApiReference);
				break;
			case "home":
			case "":
				dom.child("main", Home);
				break;
		}
		await events.next();
	}
}
