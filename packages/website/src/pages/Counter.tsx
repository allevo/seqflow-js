import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Counter.md";

export async function Counter(
	_: ComponentProps<unknown>,
	{ component }: Contexts,
) {
	component.renderSync(
		<div id="counter">
			<ContentWithToc toc={toc} html={html} title="Counter" />
		</div>,
	);
}
