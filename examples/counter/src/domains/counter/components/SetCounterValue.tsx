import { SeqflowFunctionContext, SeqflowFunctionData } from "seqflow-js";
import { Button, NumberInput } from "seqflow-js-components";
import classes from "./SetCounterValue.module.css";

export async function SetCounterValue(this: SeqflowFunctionContext) {
	this._el.classList.add(classes.wrapper);
	this.renderSync(
		<>
			<NumberInput key="choose-value" />
			<Button
				key="set-value-button"
				label="Set value"
				color="accent"
				onClick={() => {
					const input = this.getChild<HTMLInputElement>("choose-value");
					const value = input.valueAsNumber;
					this.app.domains.counter.set(value);
				}}
			/>
		</>,
	);
}
