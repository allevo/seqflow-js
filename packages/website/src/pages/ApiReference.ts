import { ComponentParam } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./ApiReference.md";

export async function ApiReference({ dom }: ComponentParam) {
	dom.render(`<div id="api-reference"></div>`);
	dom.child("api-reference", ContentWithToc, {
		data: { toc, html, title: "Api Reference" },
	});
}
