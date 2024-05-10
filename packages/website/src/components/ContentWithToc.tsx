import * as Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-twilight.css";
import { SeqflowFunctionContext } from "seqflow-js";
import classes from "./ContentWithToc.module.css";

export interface Toc {
	title: string;
	slug: string;
	type: "h2" | "h3";
	level: number;
}

function getElementFromString(string: string) {
	const template = document.createElement("div");
	template.innerHTML = string;
	return Array.from(template.children) as Element & HTMLElement[];
}

export async function ContentWithToc(
	this: SeqflowFunctionContext,
	data: { toc: Toc[]; html: string; title: string },
) {
	// await import("prismjs/components/prism-tsx.min");

	const { toc, html } = data;

	this.renderSync(
		<div className={classes.top}>
			<aside>
				<ul className="list-group">
					{toc.map((t) => (
						<li className={`list-group-item ${classes[`level-${t.level}`]}`}>
							<a className="" href={`#${t.slug}`}>
								{t.title}
							</a>
						</li>
					))}
				</ul>
			</aside>
			<main style="grid-area: main; order: 1 !important; overflow-x: hidden; padding-bottom: 30px; padding-right: 15px;">
				<h1>{data.title}</h1>
				{getElementFromString(html)}
			</main>
		</div>,
	);

	Prism.highlightAll();
}
