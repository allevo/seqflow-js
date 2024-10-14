import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./ApiReference.md";
import { Contexts } from "@seqflow/seqflow";

export async function ApiReference({}, {component}: Contexts) {
	component.renderSync(
		<div id="api-reference">
			<ContentWithToc toc={toc} html={html} title="Api Reference" />
		</div>,
	);
}
