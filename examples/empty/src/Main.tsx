import { type SeqflowFunctionContext } from "seqflow-js";
import { Card } from "seqflow-js-components";
import classes from "./Main.module.css";

export async function Main(this: SeqflowFunctionContext) {
	this.renderSync(
		<Card className={classes["card-wrapper"]}>
			<Card.Body>
				<Card.Title level={1}>Empty example</Card.Title>
				<p>This is the empty example</p>
			</Card.Body>
		</Card>,
	);
}
