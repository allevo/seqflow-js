import { ComponentParam } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Doc.md";

export async function Doc({ dom }: ComponentParam) {
	dom.render(`<div id="doc"></div>`);
	dom.child("doc", ContentWithToc, {
		data: { toc, html, title: "Documentation" },
	});
}
