import * as Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/themes/prism-twilight.css";
import { SeqflowFunctionContext } from "seqflow-js";
import classes from "./ContentWithToc.module.css";

// The order of the following imports are important.
// So, we need to keep the empty line between them.

import "prismjs/plugins/toolbar/prism-toolbar";

import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import { Prose } from "seqflow-js-components";

export interface Toc {
	title: string;
	slug: string;
	type: "h2" | "h3";
	level: number;
}

function getElementFromString(string: string) {
	const template = document.createElement("div");
	template.innerHTML = string;
	return Array.from(template.children) as HTMLElement[];
}

export async function ContentWithToc(
	this: SeqflowFunctionContext,
	data: { toc: Toc[]; html: string; title: string },
) {
	const { toc, html } = data;
	if (toc.length > 0) {
		this._el.classList.add(classes.top);
	}

	const aside = toc.length > 0
		?
		<>
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
		</>
		: <></>;

	this.renderSync(
		<>
			{aside}
			<main style="grid-area: main; order: 1 !important; overflow-x: hidden; padding-bottom: 30px; padding-right: 15px;">
				<Prose className={[classes.content, 'm-auto']}>
					<h1>{data.title}</h1>
					{...getElementFromString(html)}
				</Prose>
			</main>
		</>,
	);

	Prism.highlightAll();
}
