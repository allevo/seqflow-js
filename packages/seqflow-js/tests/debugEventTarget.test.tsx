import { screen, waitFor } from "@testing-library/dom";
import { expect, test, vi } from "vitest";

import {
	type SeqflowFunctionContext,
	createDomainEventClass,
	debugEventTarget,
	start,
} from "../src/index";

const consoleLogSpy = vi.spyOn(console, "log");

test("debugEventTarget", async () => {
	const et = debugEventTarget(new EventTarget());
	et.dispatchEvent(new Event("test"));

	await waitFor(() => expect(consoleLogSpy).toHaveBeenCalledOnce());
});
