import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-twilight.css";
import { ComponentParam } from "seqflow-js";
import classes from "./ContentWithToc.module.css";

export interface Toc {
	title: string
	slug: string
	type: 'h2' | 'h3'
}

export async function ContentWithToc({ dom, data }: ComponentParam<{ toc: Toc[]; html: string, title: string }>) {
	const { toc, html } = data;

	const tocHTML = `<ul>${toc
		.map(
			(t) => `<li><a class="p-1 rounded" href="#${t.slug}">${t.title}</a></li>`,
		)
		.join("")}</ul>`;

	dom.render(`
<div class="${classes.top}">
	<aside style="">
		${tocHTML}
	</aside>
	<div style="grid-area: main; order: 1 !important; overflow-x: hidden; padding-bottom: 30px;">
		<h1>${data.title}</h1>
		${html}
	</div>
</div>
`);

	Prism.highlightAll();
}
