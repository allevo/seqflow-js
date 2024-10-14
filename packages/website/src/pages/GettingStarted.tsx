import { Contexts } from "@seqflow/seqflow";
import { ContentWithToc } from "../components/ContentWithToc";
import * as main from "./GettingStarted.md";
import * as prerequisites from "./GettingStarted_0prerequisites.md";
import * as fetchData from "./GettingStarted_1fetchData.md";
import * as splitComponents from "./GettingStarted_2splitComponents.md";
import * as refreshQuote from "./GettingStarted_3refreshQuote.md";
import * as configuration from "./GettingStarted_4configuration.md";
import * as test from "./GettingStarted_5test.md";

export async function GettingStarted({}, {component, app}: Contexts) {
	const segments = app.router.segments;
	if (segments.length === 1) {
		component.renderSync(
			<div id="getting-started">
				<ContentWithToc
					toc={main.toc}
					html={main.html}
					title="Getting started"
				/>
			</div>,
		);
		return;
	}

	const segment = segments[1];
	switch (segment) {
		case "prerequisites":
			component.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={prerequisites.toc}
						html={prerequisites.html}
						title="Prerequisites"
					/>
				</div>,
			);
			return;
		case "fetch-data":
			component.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={fetchData.toc}
						html={fetchData.html}
						title="Fetch data"
					/>
				</div>,
			);
			return;
		case "split-components":
			component.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={splitComponents.toc}
						html={splitComponents.html}
						title="Split into components"
					/>
				</div>,
			);
			return;
		case "refresh-quote":
			component.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={refreshQuote.toc}
						html={refreshQuote.html}
						title="Refresh quote"
					/>
				</div>,
			);
			return;
		case "configuration":
			component.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={configuration.toc}
						html={configuration.html}
						title="Configuration"
					/>
				</div>,
			);
			return;
		case "test":
			component.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={test.toc}
						html={test.html}
						title="Write a test"
					/>
				</div>,
			);
			return;
	}
}
