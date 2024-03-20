import { ComponentParam } from "seqflow-js";
import { ContentWithToc } from "../components/ContentWithToc";
import { html, toc } from "./GettingStarted.md";

export async function GettingStarted({ dom }: ComponentParam) {
	dom.render(`<div id="getting-started"></div>`);
	dom.child("getting-started", ContentWithToc, {
		data: { toc, html, title: "Getting started" },
	});
}
