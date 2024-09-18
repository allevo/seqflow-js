import { expect, test } from "vitest";
import {
	combineEventAsyncGenerators,
	createAbortableEventAsyncGenerator,
	createCustomEventAsyncGenerator,
} from "../../src/events";

const eventName = "test-event";

test("events: createAbortableEventAsyncGenerator", async () => {
	const eventTarget = new EventTarget();

	const gen = createAbortableEventAsyncGenerator(eventTarget, eventName, {});
	const abortController = new AbortController();

	const ev1 = new Event(eventName);
	const ev2 = new Event(eventName);

	setTimeout(() => {
		eventTarget.dispatchEvent(ev1);
	}, 10);
	setTimeout(() => {
		eventTarget.dispatchEvent(ev2);
	}, 20);
	setTimeout(() => {
		abortController.abort(new Error("aborting"));
	}, 30);

	const events: Event[] = [];
	await expect(async () => {
		for await (const ev of gen(abortController)) {
			events.push(ev);
		}
	}).rejects.toThrow();

	expect(events.length).toEqual(2);
	expect(events[0]).equal(ev1);
	expect(events[1]).equal(ev2);
});

test("events: createAbortableEventAsyncGenerator ignores unknown events", async () => {
	const eventTarget = new EventTarget();

	const gen = createAbortableEventAsyncGenerator(eventTarget, eventName, {});
	const abortController = new AbortController();

	const ev1 = new Event(eventName);

	setTimeout(() => {
		eventTarget.dispatchEvent(ev1);
	}, 10);
	setTimeout(() => {
		eventTarget.dispatchEvent(new Event("another-event-name"));
	}, 20);
	setTimeout(() => {
		abortController.abort(new Error("aborting"));
	}, 30);

	const events: Event[] = [];
	await expect(async () => {
		for await (const ev of gen(abortController)) {
			events.push(ev);
		}
	}).rejects.toThrow();

	expect(events.length).toEqual(1);
	expect(events[0]).equal(ev1);
});

test("events: createAbortableEventAsyncGenerator ignores the event if fn return true", async () => {
	const eventTarget = new EventTarget();

	const ev1 = new Event(eventName);
	const ev2 = new Event(eventName);
	const gen = createAbortableEventAsyncGenerator(eventTarget, eventName, {
		fn: (ev) => {
			if (ev === ev1) {
				return true;
			}
		},
	});
	const abortController = new AbortController();

	setTimeout(() => {
		eventTarget.dispatchEvent(ev1);
	}, 10);
	setTimeout(() => {
		eventTarget.dispatchEvent(ev2);
	}, 20);
	setTimeout(() => {
		abortController.abort(new Error("aborting"));
	}, 30);

	const events: Event[] = [];
	await expect(async () => {
		for await (const ev of gen(abortController)) {
			events.push(ev);
		}
	}).rejects.toThrow();

	expect(events.length).toEqual(1);
	expect(events[0]).equal(ev2);
});

test("events: createAbortableEventAsyncGenerator already aborted", async () => {
	const eventTarget = new EventTarget();

	const ev1 = new Event(eventName);
	const ev2 = new Event(eventName);
	const gen = createAbortableEventAsyncGenerator(eventTarget, eventName, {
		fn: (ev) => {
			if (ev === ev1) {
				return true;
			}
		},
	});
	const abortController = new AbortController();
	abortController.abort(new Error("aborting"));

	await expect(async () => {
		for await (const _ of gen(abortController)) {
		}
	}).rejects.toThrow();
});
test("events: combineEventAsyncGenerators", async () => {
	const eventTarget1 = new EventTarget();

	const gen1 = createAbortableEventAsyncGenerator(eventTarget1, eventName, {});

	const ev1 = new Event(eventName);
	const ev2 = new Event(eventName);

	const abortController = new AbortController();
	setTimeout(() => {
		eventTarget1.dispatchEvent(ev1);
	}, 10);
	setTimeout(() => {
		eventTarget1.dispatchEvent(ev2);
	}, 20);
	setTimeout(() => {
		abortController.abort(new Error("aborting"));
	}, 20);

	const gen = combineEventAsyncGenerators(abortController, gen1);

	const events: Event[] = [];
	await expect(async () => {
		for await (const ev of gen) {
			events.push(ev);
		}
	}).rejects.toThrow();

	expect(events.length).toEqual(2);
	expect(events[0]).equal(ev1);
	expect(events[1]).equal(ev2);
});

test("events: combineEventAsyncGenerators with 2", async () => {
	const eventTarget1 = new EventTarget();
	const eventTarget2 = new EventTarget();

	const gen1 = createAbortableEventAsyncGenerator(eventTarget1, eventName, {});
	const gen2 = createAbortableEventAsyncGenerator(eventTarget2, eventName, {});

	const ev1 = new Event(eventName);
	const ev2 = new Event(eventName);

	const abortController = new AbortController();
	setTimeout(() => {
		eventTarget1.dispatchEvent(ev1);
	}, 10);
	setTimeout(() => {
		eventTarget1.dispatchEvent(ev2);
	}, 20);
	setTimeout(() => {
		eventTarget2.dispatchEvent(ev1);
	}, 11);
	setTimeout(() => {
		eventTarget2.dispatchEvent(ev2);
	}, 21);
	setTimeout(() => {
		abortController.abort(new Error("aborting"));
	}, 30);

	const events: Event[] = [];
	await expect(async () => {
		const gen = combineEventAsyncGenerators(abortController, gen1, gen2);
		for await (const ev of gen) {
			events.push(ev);
		}
	}).rejects.toThrow();

	expect(events.length).toEqual(4);
	expect(events[0]).equal(ev1);
	expect(events[1]).equal(ev1);
	expect(events[2]).equal(ev2);
	expect(events[3]).equal(ev2);
});

test("events: combineEventAsyncGenerators with many", async () => {
	const eventTargets = new Array(3).fill(0).map((_) => new EventTarget());

	const gens = eventTargets.map((ev) =>
		createAbortableEventAsyncGenerator(ev, eventName, {}),
	);

	const ev = new Event(eventName);
	const interval = setInterval(() => {
		const first = eventTargets.shift();
		if (!first) {
			abortController.abort(new Error("aborting"));
			clearInterval(interval);
			return;
		}
		first.dispatchEvent(ev);
	}, 10);

	const abortController = new AbortController();

	const events: Event[] = [];
	await expect(async () => {
		const [first, ...rest] = gens;
		const gen = combineEventAsyncGenerators(abortController, first, ...rest);
		for await (const ev of gen) {
			events.push(ev);
		}
	}).rejects.toThrow();

	expect(events.length).toEqual(gens.length);
});

test("events: combineEventAsyncGenerators with 0", async () => {
	await expect(async () => {
		const events = combineEventAsyncGenerators(new AbortController());
		for await (const _ of events) {
		}
	}).rejects.toThrow();
});

test("events: createCustomEventAsyncGenerator", async () => {
	const gen = createCustomEventAsyncGenerator<Event>();
	const abortController = new AbortController();

	const ev1 = new Event(eventName);
	const ev2 = new Event(eventName);

	setTimeout(() => {
		gen.push(ev1);
	}, 10);
	setTimeout(() => {
		gen.push(ev2);
	}, 20);
	setTimeout(() => {
		abortController.abort(new Error("aborting"));
	}, 30);

	const events: Event[] = [];
	await expect(async () => {
		for await (const ev of gen(abortController)) {
			events.push(ev);
		}
	}).rejects.toThrow();

	expect(events.length).toEqual(2);
	expect(events[0]).equal(ev1);
	expect(events[1]).equal(ev2);
});
