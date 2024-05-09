import { SeqflowFunctionContext } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./GettingStarted.md";

export async function GettingStarted(this: SeqflowFunctionContext) {
	this.renderSync(
		<div id="getting-started">
			<ContentWithToc toc={toc} html={html} title="Getting started" />
		</div>,
	);
}
