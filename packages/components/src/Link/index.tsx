import type { ComponentProps, Contexts } from "@seqflow/seqflow";

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
	{
		rel,
		color,
		href,
		underline,
		children,
		showAsButton,
	}: ComponentProps<LinkPropsType>,
	{ component, app }: Contexts,
) {
	if (showAsButton) {
		component._el.classList.add("btn");
		component._el.classList.add(`btn-${showAsButton}`);
	} else {
		component._el.classList.add("link");
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
		component._el.classList.add(`link-${color}`);
	}
	if (underline === "hover") {
		component._el.classList.add("link-hover");
	}
	if (rel) {
		component._el.setAttribute("rel", rel);
	}

	if (!children) {
		app.log.error({
			message: "Link component must have children",
		});
		return;
	}

	const el = component._el as HTMLAnchorElement;
	el.href = href;
	el.setAttribute("href", href);

	component.renderSync(children);
}
Link.tagName = () => "a";
