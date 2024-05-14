import { SeqflowFunctionContext } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import * as main from "./GettingStarted.md";
import * as prerequisites from "./GettingStarted_0prerequisites.md";
import * as fetchData from "./GettingStarted_1fetchData.md";
import * as splitComponents from "./GettingStarted_2splitComponents.md";
import * as refreshQuote from "./GettingStarted_3refreshQuote.md";
import * as configuration from "./GettingStarted_4configuration.md";
import * as test from "./GettingStarted_5test.md";

export async function GettingStarted(this: SeqflowFunctionContext) {
	const segments = this.app.router.segments;
	if (segments.length === 1) {
		this.renderSync(
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
			this.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={prerequisites.toc}
						html={prerequisites.html}
						title="Getting started - prerequisites"
					/>
				</div>,
			);
			return;
		case "fetch-data":
			this.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={fetchData.toc}
						html={fetchData.html}
						title="Getting started - fetch data"
					/>
				</div>,
			);
			return;
		case "split-components":
			this.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={splitComponents.toc}
						html={splitComponents.html}
						title="Getting started - split into components"
					/>
				</div>,
			);
			return;
		case "refresh-quote":
			this.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={refreshQuote.toc}
						html={refreshQuote.html}
						title="Getting started - refresh quote"
					/>
				</div>,
			);
			return;
		case "configuration":
			this.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={configuration.toc}
						html={configuration.html}
						title="Getting started - configuration"
					/>
				</div>,
			);
			return;
		case "test":
			this.renderSync(
				<div id="getting-started">
					<ContentWithToc
						toc={test.toc}
						html={test.html}
						title="Getting started - test"
					/>
				</div>,
			);
			return;
	}
}
