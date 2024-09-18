import { expect, test } from "vitest";
import { createDomainEventClass } from "../../src/domains";
import { domainEvent } from "../../src/events";
import { CounterChangedEvent } from "../test-utils";

test("createDomainEventClass", async () => {
	const MyEvent = createDomainEventClass("counter", "my-event");
	const ev = new MyEvent(undefined);
	expect(ev.detail).toBe(undefined);
	expect(MyEvent.domainName).toBe("counter");
	expect(MyEvent.t).toBe("my-event");
	expect(ev.type).toBe("my-event");
});

test("domainEvent: wait for events", async () => {
	const et = new EventTarget();

	const abortController = new AbortController();

	const ev1 = new CounterChangedEvent({ before: 0, current: 5 });
	const ev2 = new CounterChangedEvent({ before: 5, current: 10 });
	setTimeout(() => {
		et.dispatchEvent(ev1);
	}, 10);
	setTimeout(() => {
		et.dispatchEvent(ev2);
	}, 20);
	setTimeout(() => {
		abortController.abort();
	}, 30);

	const events: CounterChangedEvent[] = [];
	await expect(async () => {
		const gen = domainEvent(et, CounterChangedEvent)(abortController);
		for await (const ev of gen) {
			events.push(ev);
		}
	}).rejects.toThrow();

	expect(events.length).toBe(2);
	expect(events[0]).equal(ev1);
	expect(events[1]).equal(ev2);
});
