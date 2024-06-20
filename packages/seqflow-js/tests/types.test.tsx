import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";
import { type Log, type SeqflowFunctionContext, start } from "../src/index";

test("render simple button", async () => {
	async function App(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<input list="button" />);
	}

	start(
		document.body,
		App,
		{
			text: "increment",
		},
		{},
	);
	expect(document.body.innerHTML).toBe(
		'<button type="button">increment</button>',
	);
});
