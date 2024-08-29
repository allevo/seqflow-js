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
	async function App(this: SeqflowFunctionContext) {
		this.app.domains.foo.fire(1);
	}
	start(
		document.body,
		App,
		{},
		{
			domains: {
				foo: (et) => new FooDomain(debugEventTarget(et)),
			},
		},
	);

	await waitFor(() => expect(consoleLogSpy).toHaveBeenCalledOnce());
});

declare module "../src/index" {
	interface Domains {
		foo: FooDomain;
	}
}

const MyFooDomainEvent = createDomainEventClass<number>(
	"foo",
	"MyFooDomainEvent",
);
class FooDomain {
	constructor(private et: EventTarget) {}

	fire(n: number) {
		this.et.dispatchEvent(new MyFooDomainEvent(n));
	}
}
