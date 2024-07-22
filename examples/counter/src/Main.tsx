import { type SeqflowFunctionContext } from "seqflow-js";
import { Card, Divider } from "seqflow-js-components";
import classes from "./Main.module.css";
import { ApplyDeltaButton, SetCounterValue } from "./domains/counter";
import { CounterChanged } from "./domains/counter/Counter";

export async function Main(this: SeqflowFunctionContext) {
	this.renderSync(
		<Card wrapperClass={"m-auto"}>
			<Card.Body>
				<Card.Title level={1}>Counter Card</Card.Title>
				<SetCounterValue />
				<Divider />
				<div className={classes.wrapper}>
					<ApplyDeltaButton label="Decrement" delta={-1} />
					<div className={classes.counter} key="counter">
						{this.app.domains.counter.get()}
					</div>
					<ApplyDeltaButton label="Increment" delta={1} />
				</div>
			</Card.Body>
		</Card>,
	);

	const events = this.waitEvents(this.domainEvent(CounterChanged));
	for await (const ev of events) {
		this.getChild("counter").textContent = `${ev.detail.currentValue}`;
	}
}
