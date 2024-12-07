import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import { ContentWithToc } from "../components/ContentWithToc";
import * as main from "./GetStarted.md";
import * as prerequisites from "./GetStarted_0prerequisites.md";
import * as fetchData from "./GetStarted_1fetchData.md";
import * as splitComponents from "./GetStarted_2splitComponents.md";
import * as refreshQuote from "./GetStarted_3refreshQuote.md";
import * as configuration from "./GetStarted_4configuration.md";
import * as test from "./GetStarted_5test.md";
import * as domain from "./GetStarted_6domain.md";
import * as conclusion from "./GetStarted_7conclusion.md";

export async function GetStarted(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const segments = app.router.segments;
	if (segments.length === 1) {
		component.renderSync(
			<div id="get-started">
				<ContentWithToc toc={main.toc} html={main.html} title="Get started" />
			</div>,
		);
		return;
	}

	const segment = segments[1];
	switch (segment) {
		case "prerequisites":
			component.renderSync(
				<div id="get-started">
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
				<div id="get-started">
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
				<div id="get-started">
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
				<div id="get-started">
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
				<div id="get-started">
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
				<div id="get-started">
					<ContentWithToc
						toc={test.toc}
						html={test.html}
						title="Write a test"
					/>
				</div>,
			);
			return;
		case "domain":
			component.renderSync(
				<div id="get-started">
					<ContentWithToc
						toc={domain.toc}
						html={domain.html}
						title="Your first domain"
					/>
				</div>,
			);
			return;
		case "conclusion":
			component.renderSync(
				<div id="get-started">
					<ContentWithToc
						toc={conclusion.toc}
						html={conclusion.html}
						title="Conclusion"
					/>
				</div>,
			);
			return;
	}
}
