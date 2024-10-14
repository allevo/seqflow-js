import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import { Footer, FooterProps } from ".";

async function FooterExample(
	props: ComponentProps<FooterProps>,
	{ component }: Contexts,
) {
	component.renderSync(
		<Footer {...props}>
			<aside>
				<p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
			</aside>
		</Footer>,
	);
}

// biome-ignore lint/suspicious/noExplicitAny: storybook
FooterExample.__storybook = (Footer as any).__storybook;

export default {
	title: "Example/Footer",
	tags: ["autodocs"],
	component: FooterExample,
	args: {},
};

export const Empty = {};
