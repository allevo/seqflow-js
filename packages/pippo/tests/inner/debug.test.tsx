import { expect, test } from "vitest";
import {
	debugEventTarget
} from "../../src/index";


test("debugEventTarget", () => {
	const events: Event[] = []
	const et = debugEventTarget(new EventTarget(), (ev) => events.push(ev));

	const ev1 = new Event("foo");
	et.dispatchEvent(ev1);

	expect(events.length).toBe(1);
	expect(events[0]).toBe(ev1);

	const ev2 = new Event("bar");
	et.dispatchEvent(ev2);

	expect(events.length).toBe(2);
	expect(events[1]).toBe(ev2);
});