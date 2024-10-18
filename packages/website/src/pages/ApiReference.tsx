import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./ApiReference.md";

export async function ApiReference(
	_: ComponentProps<unknown>,
	{ component }: Contexts,
) {
	component.renderSync(
		<div id="api-reference">
			<ContentWithToc toc={toc} html={html} title="Api Reference" />
		</div>,
	);
}
