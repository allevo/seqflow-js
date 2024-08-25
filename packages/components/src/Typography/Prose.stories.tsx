import type { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Heading, Prose } from ".";

export default {
	title: "Example/Prose",
	tags: ["autodocs"],
	component: async function (
		this: SeqflowFunctionContext,
		{ label }: { label: string },
	) {
		this.renderSync(
			<Prose>
				<Heading title={label} />
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod
					tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
					veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut
					aliquid ex ea commodi consequatur
				</p>
			</Prose>,
		);
	},
	args: {
		label: "Heading",
	},
};

export const Simple: StoryFn<{ label: string }> = async function (
	this: SeqflowFunctionContext,
	{ label },
) {
	this.renderSync(
		<Prose>
			<Heading title={label} />
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod
				tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid
				ex ea commodi consequatur
			</p>
		</Prose>,
	);
};

export const MoreText: StoryFn<{ label: string }> = async function (
	this: SeqflowFunctionContext,
	{ label },
) {
	this.renderSync(
		<Prose wrapperClass="m-auto">
			<Heading title={label} />
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod
				tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid
				ex ea commodi consequatur
			</p>
			<Heading level={2} title={label} />
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod
				tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid
				ex ea commodi consequatur
			</p>
			<Heading level={2} title={label} />
			<Heading level={3} title={label} />
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod
				tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid
				ex ea commodi consequatur
			</p>
		</Prose>,
	);
};
