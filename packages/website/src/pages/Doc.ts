import { ComponentParam } from "seqflow-js";
import { html, toc } from "./Doc.md";
import { ContentWithToc } from "../components/ContentWithToc";

export async function Doc({ dom }: ComponentParam) {
	dom.render(`<div id="doc"></div>`);
	dom.child("doc", ContentWithToc, {
		data: { toc, html, title: "Documentation" },
	})
}
