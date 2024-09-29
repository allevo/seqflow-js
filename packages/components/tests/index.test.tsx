import { Contexts, start } from "@seqflow/seqflow";
import { expect, test } from "vitest";
import { Button } from "../src";

test("should increment and decrement the counter", async () => {
	async function App(_: unknown, { component }: Contexts) {
		component.renderSync(<Button>Button</Button>);
	}
	start(
		document.body,
		App,
		{},
		{
			domains: {},
		},
	);

	expect(document.body.innerHTML).toBe(
		'<div><button class="btn" type="button" aria-live="polite"><span class="loading loading-spinner" key="loading" style="display: none;"></span><span key="loading-text" style="display: none;">Loading...</span><span>Button</span></button></div>',
	);
});
