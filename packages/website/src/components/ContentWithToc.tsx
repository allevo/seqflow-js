import type { Contexts } from "@seqflow/seqflow";
import * as Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/themes/prism-twilight.css";
import classes from "./ContentWithToc.module.css";

// The order of the following imports are important.
// So, we have to keep the empty line between them, otherwise the linter will complain.

import "prismjs/plugins/toolbar/prism-toolbar";

import { Divider, Prose } from "@seqflow/components";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";

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
	data: { toc: Toc[]; html: string; title: string },
	{ component }: Contexts,
) {
	component._el.style.marginTop = "20px";

	const { toc, html } = data;
	if (toc.length > 0) {
		component._el.classList.add(classes.top);
	}

	const titleSlug = data.title.toLowerCase().replace(/ /g, "-");

	const aside =
		toc.length > 0 ? (
			<>
				<aside>
					<ul className="list-group">
						<li className={["list-group-item", classes["level-1"]]}>
							<a className={classes.link} href={`#${titleSlug}`}>
								{getTitle(data.title)}
							</a>
						</li>
						{toc.map((t, i) => (
							<li className={["list-group-item", classes[`level-${t.level}`]]}>
								<a className={classes.link} href={`#${t.slug}`}>
									{getTitle(t.title)}
								</a>
							</li>
						))}
					</ul>
					<Divider className={classes.divider} />
				</aside>
			</>
		) : (
			<></>
		);

	component.renderSync(
		<>
			{aside}
			<main>
				<Prose className={"m-auto"}>
					<h1 id={titleSlug}>{data.title}</h1>
					{...getElementFromString(html)}
				</Prose>
			</main>
		</>,
	);

	Prism.highlightAll();
}

function getTitle(str: string): HTMLElement {
	const title = document.createElement("div");
	title.innerHTML = str;
	return title;
}
