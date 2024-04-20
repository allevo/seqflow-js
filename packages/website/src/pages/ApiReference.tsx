import { SeqflowFunctionContext } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./ApiReference.md";

export async function ApiReference(this: SeqflowFunctionContext) {
	this.renderSync(
		<div id="api-reference">
			<ContentWithToc toc={toc} html={html} title="Api Reference" />
		</div>
	);
}
