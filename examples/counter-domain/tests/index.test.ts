import { screen, waitFor } from "@testing-library/dom";
import { start } from "seqflow-js";
import { expect, test } from "vitest";
import { Main } from "../src/Main";
import { CounterDomain } from "../src/domains/counter";

test("should increment and decrement the counter", async () => {
	start(document.body, Main, {
		log() {},
		domains: {
			counter: (eventTarget) => {
				return new CounterDomain(eventTarget);
			},
		},
	});

	const incrementButton =
		await screen.findByText<HTMLButtonElement>("Increment");
	const decrementButton =
		await screen.findByText<HTMLButtonElement>("Decrement");
	const counterDiv = await screen.findByText<HTMLDivElement>("0");

	expect(counterDiv.textContent).toBe("0");

	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("2"));
	decrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
});
