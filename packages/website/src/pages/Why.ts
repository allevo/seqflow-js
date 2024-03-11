import { ComponentParam } from "seqflow-js";
import { html, toc } from './Why.md'
import { ContentWithToc } from "../components/ContentWithToc";

export async function Why({ dom }: ComponentParam) {
	dom.render(`<div id="why"></div>`);
	dom.child("why", ContentWithToc, {
		data: { toc, html, title: 'Why SeqFlow?' },
	})
}
