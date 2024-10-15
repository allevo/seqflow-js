import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { Button, Form, FormField, NumberInput } from "seqflow-js-components";
import classes from "./SetCounterValue.module.css";

export async function SetCounterValue(
	_: unknown,
	{ component, app }: Contexts,
) {
	component.renderSync(
		<Form key="form" className={[classes.wrapper, "a"]}>
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

	const events = component.waitEvents(
		component.domEvent("form", "submit", { preventDefault: true }),
	);
	for await (const _ of events) {
		const input = component.getChild<HTMLInputElement>("choose-value");
		const value = input.valueAsNumber;
		app.domains.counter.set(value);
	}
}
