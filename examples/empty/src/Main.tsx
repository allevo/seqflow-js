import { Card } from "@seqflow/components";
import classes from "./Main.module.css";
import { ComponentProps, Contexts } from "@seqflow/seqflow";

export async function Main(
	_: ComponentProps<unknown>,
	{ component }: Contexts,
) {
	component.renderSync(
		<Card className={classes["card-wrapper"]}>
			<Card.Body>
				<Card.Title level={1}>Empty example</Card.Title>
				<p>This is the empty example</p>
			</Card.Body>
		</Card>,
	);
}
