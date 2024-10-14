import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Why.md";
import { Contexts } from "@seqflow/seqflow";

export async function Why({}, {component}: Contexts) {
	component.renderSync(
		<div id="why">
			<ContentWithToc toc={toc} html={html} title="Why SeqFlow?" />
		</div>,
	);
}
