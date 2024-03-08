import { ComponentParam } from "seqflow-js";
import { Header } from "./components/Header";
import { Doc } from "./pages/Doc";
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
			case "doc":
				dom.child("main", Doc);
				break;
			case "why":
				dom.child("main", Why);
				break;
			case "home":
			case "":
				dom.child("main", Home);
				break;
		}
		await events.next();
	}
}
