import { screen } from "@testing-library/dom";
import { start } from "seqflow-js";
import { test } from "vitest";
import { Main } from "../src/Main";

test("should render hi", async () => {
	start(document.body, Main, undefined, {});
	await screen.findByText(/Hi!/i);
});
