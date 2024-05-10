import { SeqflowFunctionContext } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Example.md";

export async function Example(this: SeqflowFunctionContext) {
	this.renderSync(
		<div id="examples">
			<ContentWithToc toc={toc} html={html} title="Examples" />
		</div>,
	);
}
