import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-twilight.css";
import { ComponentParam } from "seqflow-js";
import classes from "./ContentWithToc.module.css";

export interface Toc {
	title: string;
	slug: string;
	type: "h2" | "h3";
	level: number;
}

export async function ContentWithToc({
	dom,
	data,
}: ComponentParam<{ toc: Toc[]; html: string; title: string }>) {
	const { toc, html } = data;

	const tocHTML = `<ul class="list-group">${toc
		.map(
			(t) =>
				`<li class="list-group-item ${
					classes[`level-${t.level}`]
				}"><a class="" href="#${t.slug}">${t.title}</a></li>`,
		)
		.join("")}</ul>`;

	dom.render(`
<div class="${classes.top}">
	<aside style="">
		${tocHTML}
	</aside>
	<main style="grid-area: main; order: 1 !important; overflow-x: hidden; padding-bottom: 30px; padding-right: 15px;">
		<h1>${data.title}</h1>
		${html}
	</main>
</div>
`);

	Prism.highlightAll();
}
