import { SeqflowFunctionContext, start } from "seqflow-js";
import { expect, test } from "vitest";
import { Button } from "../src";

test("should increment and decrement the counter", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(<Button label="Button" />);
	}
	start(document.body, App, {}, {});

	expect(document.body.innerHTML).toBe(
		'<button class="btn" type="button"><span class="loading loading-spinner" key="loading" style="display: none;"></span>Button</button>',
	);
});
