import { SeqflowFunctionContext } from "seqflow-js";
import { Header } from "./components/Header";
import { ApiReference } from "./pages/ApiReference";
import { Example } from "./pages/Example";
import { GettingStarted } from "./pages/GettingStarted";
import { Home } from "./pages/Home";
import { Why } from "./pages/Why";

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

export async function Main(this: SeqflowFunctionContext) {
	const InitalComponent = getComponent(this.app.router.segments);
	this.renderSync(
		<>
			<Header style={{ position: "sticky", top: "0px", zIndex: "50" }} />
			<div id="main" className="flex-grow-1 overflow-y-auto relative">
				<InitalComponent key="main" />
			</div>
		</>,
	);

	const events = this.waitEvents(this.navigationEvent());
	for await (const _ of events) {
		const Component = getComponent(this.app.router.segments);
		this.replaceChild("main", () => <Component key="main" />);
	}
}
