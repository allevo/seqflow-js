import type { ComponentProps, Contexts } from "@seqflow/seqflow";

export interface FooterProps {
	center?: boolean;
}

export async function Footer(
	{ children, center }: ComponentProps<FooterProps>,
	{ component, app }: Contexts,
) {
	if (!children || children.length === 0) {
		app.log.error({
			message: "Footer component must have children",
		});
		return;
	}

	const classes = ["footer"];
	if (center) {
		classes.push("footer-center");
	}
	component._el.classList.add(...classes);

	component.renderSync(children);
}
Footer.tagName = () => "footer";
