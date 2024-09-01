import { screen } from "@testing-library/dom";
import { start } from "seqflow-js";
import { expect, test } from "vitest";
import { Main } from "../src/Main";

test("should increment and decrement the counter", async () => {
	start(document.body, Main, undefined, {});

	const el = await screen.findAllByText(/empty/i);

	expect(el.length).greaterThan(0);
});
