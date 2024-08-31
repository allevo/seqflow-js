import type { SeqflowFunctionContext } from "seqflow-js";
import type { StoryFn } from "seqflow-js-storybook";
import { Body, Card, type CardProps } from ".";
import { Button } from "../Button";

async function CardStory(this: SeqflowFunctionContext, props: CardProps) {
	this.renderSync(
		<Card {...props} className={"w-96 m-auto"}>
			<Body>
				<Card.Title level={1}>Card title</Card.Title>
				<p>The content of the Card</p>
				<Card.Actions>
					<Button color="primary">Do something</Button>
				</Card.Actions>
			</Body>
		</Card>,
	);
}

// biome-ignore lint/suspicious/noExplicitAny: storybook
CardStory.__storybook = (Card as any).__storybook;

export default {
	title: "Example/Card",
	tags: ["autodocs"],
	component: CardStory,
	args: {
		shadow: "md",
	},
};

export const Empty = {};

export const Centered: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<Card shadow="md">
			<Body className="items-center text-center">
				<Card.Title level={1}>Card title</Card.Title>
				<p>The content of the Card</p>
				<Card.Actions>
					<Button color="primary">Do something</Button>
				</Card.Actions>
			</Body>
		</Card>,
	);
};

export const ActionOnTop: StoryFn<unknown> = async function (
	this: SeqflowFunctionContext,
) {
	this.renderSync(
		<Card shadow="md">
			<Card.Body>
				<Card.Actions>
					<Button size="sm">X</Button>
				</Card.Actions>
				<Card.Title level={1}>Card title</Card.Title>
				<p>The content of the Card</p>
			</Card.Body>
		</Card>,
	);
};
