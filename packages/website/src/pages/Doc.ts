import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-twilight.css";
import { ComponentParam } from "seqflow-js";
import { html, toc } from "./Doc.md";
import classes from "./Doc.module.css";

console.log(classes);

export async function Doc({ dom, event, router }: ComponentParam) {
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
		${html}
	</div>
</div>
`);

	Prism.highlightAll();

	/*
	const aside = dom.querySelector('aside')

	const currentHost = window.location.host

	const events = event.waitEvent(
		event.domEvent('click')
	)
	for await (const ev of events) {
		const target = ev.target
		if (!(target instanceof HTMLAnchorElement)) {
			continue
		}
		if (aside.contains(target as Node)) {
			const id = target.getAttribute('href')
			if (id && id.startsWith('#')) {
				const el = dom.querySelector(`${id}`)
				if (el) {
					el.scrollIntoView({ behavior: 'smooth' })
				}
			}
		}
	}
	*/
}
