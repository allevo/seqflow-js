import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Link, type LinkPropsType } from ".";

async function LinkStory(
	this: SeqflowFunctionContext,
	{ children, ...props }: SeqflowFunctionData<LinkPropsType>,
) {
	this.renderSync(<Link {...props}>This is a link</Link>);
}
// biome-ignore lint/suspicious/noExplicitAny: storybook
LinkStory.__storybook = (Link as any).__storybook;

export default {
	title: "Example/Link",
	tags: ["autodocs"],
	component: LinkStory,
	args: {},
};

export const Empty = {};

export const AllLinks = async function AllLinks(
	this: SeqflowFunctionContext,
	_: SeqflowFunctionData<unknown>,
) {
	this.renderSync(
		<div>
			<Link href="https://seqflow.dev">Link</Link>
			<Link showAsButton="primary" href="https://seqflow.dev">
				Link
			</Link>
			<Link showAsButton="secondary" href="https://seqflow.dev">
				Link
			</Link>
			<Link showAsButton="accent" href="https://seqflow.dev">
				Link
			</Link>
			<Link showAsButton="ghost" href="https://seqflow.dev">
				Link
			</Link>
			<Link showAsButton="link" href="https://seqflow.dev">
				Link
			</Link>
			<Link showAsButton="info" href="https://seqflow.dev">
				Link
			</Link>
			<Link showAsButton="success" href="https://seqflow.dev">
				Link
			</Link>
			<Link showAsButton="warning" href="https://seqflow.dev">
				Link
			</Link>
			<Link showAsButton="error" href="https://seqflow.dev">
				Link
			</Link>
		</div>,
	);
};
