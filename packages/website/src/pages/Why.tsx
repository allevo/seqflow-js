import { SeqflowFunctionContext } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Why.md";

export async function Why(this: SeqflowFunctionContext) {
	this.renderSync(<div id="why">
		<ContentWithToc toc={toc} html={html} title="Why SeqFlow?" />
	</div>);
}
