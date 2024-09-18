import { screen, waitFor } from "@testing-library/dom";
import { afterEach, beforeEach, expect, test } from "vitest";
import {
	SeqFlowComponentContext,
} from "../../src/index";
import { BrowserRouter, InMemoryRouter, NavigationEvent } from "../../src/router";
import { navigationEvent } from "../../src/events";

let component: SeqFlowComponentContext;
let abortController: AbortController;
let logs: any[] = []
beforeEach(() => {
	document.body.innerHTML = "";
	abortController = new AbortController();
	component = new SeqFlowComponentContext(document.body, abortController, {
		log: {
			debug: (...args: any[]) => logs.push(args),
			error: (...args: any[]) => logs.push(args),
		},
	});
});
afterEach(() => {
	abortController.abort();
});

test("router: InMemoryRouter navgation & events", async () => {
	const abortController = new AbortController()
	const eventTarget = new EventTarget();
	const router = new InMemoryRouter(eventTarget, '/')

	router.install()

	const events: NavigationEvent[] = []
	const p = async function() {
		for await (const ev of navigationEvent(eventTarget)(abortController)) {
			events.push(ev)
		}
	}()

	expect(router.segments).toEqual([''])

	router.navigate('/foo')
	expect(router.segments).toEqual(['foo'])

	router.navigate('/foo/bar/baz')
	expect(router.segments).toEqual(['foo', 'bar', 'baz'])

	router.back()
	expect(router.segments).toEqual(['foo'])

	router.back()
	expect(router.segments).toEqual([''])

	router.back()
	expect(router.segments).toEqual([''])

	setTimeout(() => {
		abortController.abort()
	}, 10);

	await expect(p).rejects.toThrow()

	expect(events.map(e => e.path)).toEqual([
		'/foo',
		'/foo/bar/baz',
		'/foo',
		'/',
	])
});

test('router: BrowserRouter', async () => {
	const abortController = new AbortController()
	const eventTarget = new EventTarget();
	const router = new BrowserRouter(eventTarget)

	router.install()

	const events: NavigationEvent[] = []
	const p = async function() {
		for await (const ev of navigationEvent(eventTarget)(abortController)) {
			events.push(ev)
		}
	}()


	expect(router.segments).toEqual([''])

	router.navigate('/foo')
	expect(router.segments).toEqual(['foo'])

	router.navigate('/foo/bar/baz')
	await waitFor(() => expect(router.segments).toEqual(['foo', 'bar', 'baz']))

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
		abortController.abort()
	}, 10);

	await expect(p).rejects.toThrow()


	await waitFor(() => expect(events.map(e => e.path)).toEqual([
		'/foo',
		'/foo/bar/baz',
		// '/foo',
		// '/',
	]))
})