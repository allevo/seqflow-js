import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Why.md";

export async function Why(_: ComponentProps<unknown>, { component }: Contexts) {
	component.renderSync(
		<div id="why">
			<ContentWithToc toc={toc} html={html} title="Why SeqFlow?" />
		</div>,
	);
}
