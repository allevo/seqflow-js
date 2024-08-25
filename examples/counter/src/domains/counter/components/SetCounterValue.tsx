import type { SeqflowFunctionContext } from "seqflow-js";
import { Button, NumberInput } from "seqflow-js-components";
import classes from "./SetCounterValue.module.css";

export async function SetCounterValue(this: SeqflowFunctionContext) {
	this._el.classList.add(classes.wrapper);
	this.renderSync(
		<>
			<NumberInput name="set-value" key="choose-value" />
			<Button
				key="set-value-button"
				color="accent"
				onClick={() => {
					const input = this.getChild<HTMLInputElement>("choose-value");
					const value = input.valueAsNumber;
					this.app.domains.counter.set(value);
				}}
			>
				Set value
			</Button>
		</>,
	);
}
