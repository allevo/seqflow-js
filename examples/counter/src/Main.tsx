import { Card, Divider } from "@seqflow/components";
import type { Contexts } from "@seqflow/seqflow";
import classes from "./Main.module.css";
import {
	ApplyDeltaButton,
	SetCounterValue,
	ShowValue,
} from "./domains/counter";

export async function Main({}, { component }: Contexts) {
	component.renderSync(
		<Card
			compact
			className={"m-auto w-96 bg-slate-900 text-slate-200 mt-6"}
			shadow="md"
		>
			<Card.Body>
				<Card.Title level={1}>Counter Card</Card.Title>
				<div className={classes.wrapper}>
					<ApplyDeltaButton label="Decrement" delta={-1} />
					<ShowValue className={classes.counter} />
					<ApplyDeltaButton label="Increment" delta={1} />
				</div>
				<Divider style={{ height: "auto", marginBottom: "0px" }} />
				<SetCounterValue />
			</Card.Body>
		</Card>,
	);
}
