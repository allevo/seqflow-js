import { Contexts } from "@seqflow/seqflow";
import { Header } from "./components/Header";
import { ApiReference } from "./pages/ApiReference";
import { Example } from "./pages/Example";
import { GettingStarted } from "./pages/GettingStarted";
import { Home } from "./pages/Home";
import { Why } from "./pages/Why";
import classes from './Main.module.css';
import { Divider, Footer } from "@seqflow/components";

function getComponent(path: string[]) {
	switch (path[0]) {
		case "getting-started":
			return GettingStarted;
		case "why":
			return Why;
		case "api-reference":
			return ApiReference;
		case "examples":
			return Example;
		default:
			return Home;
	}
}

export async function Main({}, { component, app}: Contexts) {
	component._el.classList.add(classes.wrapper);
	const InitalComponent = getComponent(app.router.segments);
	component.renderSync(
		<>
			<Header className={classes.header} />
			<div id={classes.main}>
				<InitalComponent key="main" />
			</div>
			<Footer center style="height: 100px; background-color: rgb(43, 48, 53);">
				<aside>
					<p>Seqflow, Copyright © {new Date().getFullYear()} The Seqflow team, Licensed under MIT</p>
				</aside>
			</Footer>
		</>,
	);

	const events = component.waitEvents(component.navigationEvent());
	for await (const _ of events) {
		const Component = getComponent(app.router.segments);
		component.replaceChild("main", () => <Component key="main" />);
	}
}
