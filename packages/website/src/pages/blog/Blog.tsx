import { Divider, Heading, Hero, Link, Prose, Tabs } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import classes from "./Blog.module.css";

import { html } from "./2024-11-24-theres-a-new-framework-in-town.md";

export async function Blog(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.style.backgroundColor = "rgb(6, 6, 6)";
	component._el.style.minHeight = "100vh";

	component._el.style.paddingTop = "15px";

	const segments = app.router.segments;
	if (segments.length === 1) {
		component.renderSync(
			<Prose className={["m-auto"]} style={{ maxWidth: "786px" }}>
				<Heading level={1}>Blog</Heading>
				<ol>
					<li>
						<Heading level={2}>
							<Link href="/blog/2024-11-24-theres-a-new-framework-in-town">
								There's a New Framework in Town!
							</Link>
						</Heading>
						<p>
							Release 1.0.0-rc1 is out! We are excited to announce the first
							release candidate of SeqFlow. This release includes a new
							framework that makes it easier to build web applications.
						</p>
					</li>
				</ol>
			</Prose>,
		);
		return;
	}

	component._el.style.paddingBottom = "15px";

	const segment = segments[1];
	switch (segment) {
		case "2024-11-24-theres-a-new-framework-in-town": {
			const element = getElementFromString(html);

			component.renderSync([
				<Prose className={["m-auto", classes.blogPost]}>
					<Heading className={"text-center"} level={1}>
						There's a New Framework in Town!
					</Heading>
					<img
						src="/images/blog/2024-11-24-theres-a-new-framework-in-town.svg"
						alt="the amazing SeqFlow logo"
						style={{ borderRadius: "15px", border: "1px solid #2b2f35" }}
					/>
					{element}
				</Prose>,
			]);
			break;
		}
	}
}

function getElementFromString(string: string) {
	const template = document.createElement("div");
	template.innerHTML = string;
	return Array.from(template.children) as HTMLElement[];
}
