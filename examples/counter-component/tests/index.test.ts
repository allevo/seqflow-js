import { waitFor } from "@testing-library/dom";
import { start } from "seqflow-js";
import { expect, test } from "vitest";
import { Main } from "../src/Main";

test("should increment and decrement the counter", async () => {
	start(document.body, Main);

	const incrementButton =
		document.querySelector<HTMLButtonElement>("#increment");
	const decrementButton =
		document.querySelector<HTMLButtonElement>("#decrement");
	const counterDiv = document.querySelector<HTMLDivElement>("#counter");

	expect(counterDiv?.textContent).toBe("0");

	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("2"));
	decrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
});
