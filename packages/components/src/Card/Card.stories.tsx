import { SeqflowFunctionContext } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Card } from ".";
import { Button } from "../Button";

export default {
	title: "Example/Card",
	tags: ["autodocs"],
	component: async function (this: SeqflowFunctionContext) {
		this.renderSync(
			<Card>
				<Card.Body>
					<Card.Title>Card title</Card.Title>
					<p>The content of the Card</p>
					<Card.Actions>
						<Button color="primary" label="do something" />
					</Card.Actions>
				</Card.Body>
			</Card>,
		);
	},
	args: {},
};

export const Empty = {};

export const Centered: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<Card>
			<Card.Body wrapperClass="items-center text-center">
				<Card.Title>Card title</Card.Title>
				<p>The content of the Card</p>
				<Card.Actions>
					<Button color="primary" label="do something" />
				</Card.Actions>
			</Card.Body>
		</Card>,
	);
};

export const ActionOnTop: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<Card>
			<Card.Body>
				<Card.Actions>
					<Button label="X" />
				</Card.Actions>
				<Card.Title>Card title</Card.Title>
				<p>The content of the Card</p>
			</Card.Body>
		</Card>,
	);
};
