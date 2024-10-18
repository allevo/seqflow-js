import { start } from "@seqflow/seqflow";
import { screen } from "@testing-library/dom";
import { expect, test } from "vitest";
import { Main } from "../src/Main";

test("should increment and decrement the counter", async () => {
	start(document.body, Main, {}, {});

	const el = await screen.findAllByText(/empty/i);

	expect(el.length).greaterThan(0);
});
