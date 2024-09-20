import { screen, waitFor } from "@testing-library/dom";
import { afterEach, beforeEach, expect, test } from "vitest";
import { navigationEvent } from "../../src/events";
import { SeqFlowComponentContext } from "../../src/index";
import {
	BrowserRouter,
	InMemoryRouter,
	type NavigationEvent,
} from "../../src/router";
import { CounterDomain, createAppForInnerTest } from "../test-utils";

let component: SeqFlowComponentContext;
let abortController: AbortController;
const logs: any[] = [];
beforeEach(() => {
	document.body.innerHTML = "";
	abortController = new AbortController();
	component = new SeqFlowComponentContext(
		document.body,
		abortController,
		createAppForInnerTest(logs),
	);
});
afterEach(() => {
	abortController.abort();
});

test("router: InMemoryRouter navgation & events", async () => {
	const abortController = new AbortController();
	const eventTarget = new EventTarget();
	const router = new InMemoryRouter(eventTarget, "/");

	router.install();

	expect(router.getEventTarget()).equal(eventTarget);

	const events: NavigationEvent[] = [];
	const p = (async () => {
		for await (const ev of navigationEvent(eventTarget)(abortController)) {
			events.push(ev);
		}
	})();

	expect(router.segments).toEqual([""]);

	router.navigate("/foo");
	expect(router.segments).toEqual(["foo"]);

	router.navigate("/foo/bar/baz");
	expect(router.segments).toEqual(["foo", "bar", "baz"]);

	router.back();
	expect(router.segments).toEqual(["foo"]);

	router.back();
	expect(router.segments).toEqual([""]);

	router.back();
	expect(router.segments).toEqual([""]);

	setTimeout(() => {
		abortController.abort();
	}, 10);

	await expect(p).rejects.toThrow();

	expect(events.map((e) => e.path)).toEqual([
		"/foo",
		"/foo/bar/baz",
		"/foo",
		"/",
	]);
});

test("router: BrowserRouter", async () => {
	const abortController = new AbortController();
	const eventTarget = new EventTarget();
	const router = new BrowserRouter(eventTarget);

	router.install();

	expect(router.getEventTarget()).equal(eventTarget);

	const events: NavigationEvent[] = [];
	const p = (async () => {
		for await (const ev of navigationEvent(eventTarget)(abortController)) {
			events.push(ev);
		}
	})();

	expect(router.segments).toEqual([""]);

	router.navigate("/foo");
	expect(router.segments).toEqual(["foo"]);

	router.navigate("/foo/bar/baz");
	await waitFor(() => expect(router.segments).toEqual(["foo", "bar", "baz"]));

	// https://github.com/jsdom/jsdom/issues/1565
	// Back api in JSDOM is not working as expected

	/*
	router.back()
	await waitFor(() => expect(router.segments).toEqual(['foo']))

	router.back()
	await waitFor(() => expect(router.segments).toEqual(['']))

	router.back()
	await waitFor(() => expect(router.segments).toEqual(['']))
	*/

	setTimeout(() => {
		abortController.abort();
	}, 10);

	await expect(p).rejects.toThrow();

	await waitFor(() =>
		expect(events.map((e) => e.path)).toEqual([
			"/foo",
			"/foo/bar/baz",
			// '/foo',
			// '/',
		]),
	);
});
