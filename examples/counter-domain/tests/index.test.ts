import { screen, waitFor } from "@testing-library/dom";
import { start } from "seqflow-js";
import { expect, test } from "vitest";
import { Main } from "../src/Main";
import { CounterDomain } from "../src/domains/counter";

test("should increment and decrement the counter", async () => {
	start(document.body, Main, undefined, {
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
	const resetButton =
		await screen.findByText<HTMLButtonElement>("Reset");
	const counterDiv = await screen.findByText<HTMLDivElement>("0");

	expect(counterDiv.textContent).toBe("0");

	// increment the counter
	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
	// increment the counter again
	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("2"));
	// decrement the counter
	decrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
	// reset the counter
	resetButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("0"));
	// counter can be negative
	decrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("-1"));
	// reset the counter again
	resetButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("0"));
});
