import type { SeqflowFunctionContext } from "seqflow-js";
import { Card, Divider } from "seqflow-js-components";
import classes from "./Main.module.css";
import { ApplyDeltaButton, SetCounterValue, ShowValue } from "./domains/counter";

export async function Main(this: SeqflowFunctionContext) {
	this.renderSync(
		<Card compact className={"m-auto w-96 bg-neutral text-neutral-content mt-6"} shadow="md">
			<Card.Body>
				<Card.Title level={1}>Counter Card</Card.Title>
				<div className={classes.wrapper}>
					<ApplyDeltaButton label="Decrement" delta={-1} />
					<ShowValue className={classes.counter} />
					<ApplyDeltaButton label="Increment" delta={1} />
				</div>
				<Divider style={{ height: 'auto', marginBottom: '0px' }} />
				<SetCounterValue />
			</Card.Body>
		</Card>,
	);
}
