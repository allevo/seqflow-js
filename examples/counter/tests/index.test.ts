import { start } from "@seqflow/seqflow";
import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";
import { Main } from "../src/Main";
import { CounterDomain } from "../src/domains/counter";

test("should increment and decrement the counter", async () => {
	start(
		document.body,
		Main,
		{},
		{
			domains: {
				counter: (et) => new CounterDomain(et),
			},
		},
	);

	const incrementButton = await screen.findByText(/increment/i);
	const decrementButton = await screen.findByText(/decrement/i);
	const setValueButton = await screen.findByText(/Set value/i);
	const spinInput = await screen.findByRole<HTMLInputElement>("spinbutton");
	const counterDiv = await screen.findByText(/0/i);

	expect(counterDiv?.textContent).toBe("0");

	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("2"));
	decrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));

	spinInput.value = "10";
	setValueButton?.click();

	await waitFor(() => expect(counterDiv?.textContent).toBe("10"));
});
