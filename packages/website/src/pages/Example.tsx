import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Example.md";

export async function Example(
	_: ComponentProps<unknown>,
	{ component }: Contexts,
) {
	component.renderSync(
		<div id="examples">
			<ContentWithToc toc={toc} html={html} title="Examples" />
		</div>,
	);
}
