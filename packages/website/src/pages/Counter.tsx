import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Counter.md";
import { Contexts } from "@seqflow/seqflow";

export async function Counter({}, {component}: Contexts) {
	component.renderSync(
		<div id="counter">
			<ContentWithToc toc={toc} html={html} title="Counter" />
		</div>,
	);
}
