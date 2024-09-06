import type { SeqflowFunctionContext } from "seqflow-js";
import { Button, Form, FormField, NumberInput } from "seqflow-js-components";
import classes from "./SetCounterValue.module.css";

export async function SetCounterValue(this: SeqflowFunctionContext) {
	this.renderSync(
		<Form className={[classes.wrapper, "a"]}>
			<FormField label={"Choose a value"} className={"w-full max-w-xs"}>
				<NumberInput required name="set-value" key="choose-value" />
			</FormField>
			<Button
				key="set-value-button"
				type="submit"
				color="secondary"
				className={classes.submitButton}
			>
				Set value
			</Button>
		</Form>,
	);

	const events = this.waitEvents(
		this.domEvent("submit", { el: this._el, preventDefault: true }),
	);
	for await (const _ of events) {
		const input = this.getChild<HTMLInputElement>("choose-value");
		const value = input.valueAsNumber;
		this.app.domains.counter.set(value);
	}
}
