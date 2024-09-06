import { type SeqflowFunctionContext, start } from "seqflow-js";
import { expect, test } from "vitest";
import { Button } from "../src";

test("should increment and decrement the counter", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(<Button>Button</Button>);
	}
	start(document.body, App, {}, {});

	expect(document.body.innerHTML).toBe(
		'<button class="btn" type="button" aria-live="polite"><span class="loading loading-spinner" key="loading" style="display: none;"></span><span key="loading-text" style="display: none;">Loading...</span><span>Button</span></button>',
	);
});
