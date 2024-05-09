import { SeqflowFunctionContext } from "seqflow-js";
import { Header } from "./components/Header";
import { ApiReference } from "./pages/ApiReference";
import { GettingStarted } from "./pages/GettingStarted";
import { Home } from "./pages/Home";
import { Why } from "./pages/Why";

function getComponent(path: string) {
	switch (path) {
		case "getting-started":
			return GettingStarted;
		case "why":
			return Why;
		case "api-reference":
			return ApiReference;
		default:
			return Home;
	}
}

export async function Main(this: SeqflowFunctionContext) {
	const InitalComponent = getComponent(this.app.router.segments.pop());
	this.renderSync(
		<>
			<Header />
			<div id="main" class="flex-grow-1 overflow-y-auto">
				<InitalComponent key="main" />
			</div>
		</>,
	);

	const events = this.waitEvents(this.navigationEvent());
	for await (const _ of events) {
		const Component = getComponent(this.app.router.segments.pop());
		this.replaceChild("main", () => <Component key="main" />);
	}
}
