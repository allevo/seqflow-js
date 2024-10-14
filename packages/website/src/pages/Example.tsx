import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Example.md";
import { Contexts } from "@seqflow/seqflow";

export async function Example({}, {component}: Contexts) {
	component.renderSync(
		<div id="examples">
			<ContentWithToc toc={toc} html={html} title="Examples" />
		</div>,
	);
}
