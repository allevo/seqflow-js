import { start } from "@seqflow/seqflow";
import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";
import { Counter, CounterDomain } from "../src/Counter";
import { ExternalChangeValue } from "../src/external";

test("should increment and decrement the counter", async () => {
	const externalEventTarget = new EventTarget();
	start(
		document.body,
		Counter,
		{},
		{
			domains: {
				counter: (et) => new CounterDomain(et, externalEventTarget, 0),
				external: () => externalEventTarget,
			},
		},
	);

	const incrementButton = await screen.findByText(/increment/i);
	const decrementButton = await screen.findByText(/decrement/i);
	const counterDiv = await screen.findByText(/0/i);

	expect(counterDiv?.textContent).toBe("0");

	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("2"));
	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("3"));
	decrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("2"));
	externalEventTarget.dispatchEvent(new ExternalChangeValue({ newValue: 10 }));
	await waitFor(() => expect(counterDiv?.textContent).toBe("10"));
});
