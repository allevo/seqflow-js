import { Footer } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import classes from "./Main.module.css";
import { Header } from "./components/Header";
import { Example } from "./pages/Example";
import { GetStarted } from "./pages/GetStarted";
import { Home } from "./pages/Home";
import { Why } from "./pages/Why";

function getComponent(path: string[]) {
	switch (path[0]) {
		case "get-started":
			return GetStarted;
		case "why":
			return Why;
		case "examples":
			return Example;
		default:
			return Home;
	}
}

export async function Main(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.classList.add(classes.wrapper);
	const InitalComponent = getComponent(app.router.segments);
	component.renderSync(
		<>
			<Header className={classes.header} />
			<div id={classes.main}>
				<InitalComponent key="main" />
			</div>
			<Footer center style="height: 100px;">
				<aside>
					<p>
						SeqFlow, Copyright © {new Date().getFullYear()} The SeqFlow team,
						Licensed under MIT
					</p>
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
