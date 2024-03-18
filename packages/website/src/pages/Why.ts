import { ComponentParam } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./Why.md";

export async function Why({ dom }: ComponentParam) {
	dom.render(`<div id="why"></div>`);
	dom.child("why", ContentWithToc, {
		data: { toc, html, title: "Why SeqFlow?" },
	});
}
