import { SeqflowFunctionContext } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Counter.md";

export async function Counter(this: SeqflowFunctionContext) {
	this.renderSync(
		<div id="counter">
			<ContentWithToc toc={toc} html={html} title="Counter" />
		</div>,
	);
}
