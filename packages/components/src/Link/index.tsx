import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";

export interface LinkPropsType {
	color?:
		| "neutral"
		| "primary"
		| "secondary"
		| "accent"
		| "success"
		| "info"
		| "warning"
		| "error";
	underline?: "hover" | "always";
	showAsButton?:
		| "neutral"
		| "primary"
		| "secondary"
		| "accent"
		| "ghost"
		| "link"
		| "info"
		| "success"
		| "warning"
		| "error";
	href: string;
	rel?:
		| "alternate"
		| "author"
		| "bookmark"
		| "canonical"
		| "dns-prefetch"
		| "external"
		| "expect"
		| "help"
		| "icon"
		| "license"
		| "manifest"
		| "me"
		| "modulepreload"
		| "next"
		| "nofollow"
		| "noopener"
		| "noreferrer"
		| "opener"
		| "pingback"
		| "preconnect"
		| "prefetch"
		| "preload"
		| "prerender"
		| "prev"
		| "privacy-policy"
		| "search"
		| "stylesheet"
		| "tag"
		| "terms-of-service"
		| (string & {});
	target?: "_blank" | "_self" | "_parent" | "_top" | (string & {});
}

export async function Link(
	this: SeqflowFunctionContext,
	{
		rel,
		color,
		href,
		underline,
		children,
		showAsButton,
	}: SeqflowFunctionData<LinkPropsType>,
) {
	if (showAsButton) {
		this._el.classList.add("btn");
		this._el.classList.add(`btn-${showAsButton}`);
	} else {
		this._el.classList.add("link");
	}

	if (color) {
		/*
		link-neutral
		link-primary
		link-secondary
		link-accent
		link-success
		link-info
		link-warning
		link-error
		*/
		this._el.classList.add(`link-${color}`);
	}
	if (underline === "hover") {
		this._el.classList.add("link-hover");
	}
	if (rel) {
		this._el.setAttribute("rel", rel);
	}

	if (!children) {
		this.app.log.error({
			message: "Link component must have children",
		});
		return;
	}

	const el = this._el as HTMLAnchorElement;
	el.href = href;
	el.setAttribute("href", href);

	this.renderSync(children);
}
Link.tagName = () => "a";
