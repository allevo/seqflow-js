import { expect, test } from "vitest";
import { ComponentParam, NavigationEvent, start } from "../src/index";

test("navigation even", async () => {
	async function Button({ dom, event, router }: ComponentParam) {
		dom.render('<input name="path"><button type="button">increment</button>');

		const input = dom.querySelector<HTMLInputElement>("input");

		const events = event.waitEvent(event.domEvent("click"));
		for await (const _ of events) {
			router.navigate(input.value);
		}
	}
	async function app({ dom, event, router }: ComponentParam) {
		dom.render(
			'<div><div id="button"></div><p id="eventPath"></p></div><p id="segments"></p></div><p id="query"></p></div>',
		);
		dom.child("button", Button);

		const eventPath = dom.querySelector<HTMLParagraphElement>("#eventPath");
		const segments = dom.querySelector<HTMLParagraphElement>("#segments");
		const query = dom.querySelector<HTMLParagraphElement>("#query");

		const events = event.waitEvent(event.navigationEvent());
		for await (const event of events) {
			eventPath.textContent = (event as NavigationEvent).path;
			segments.textContent = JSON.stringify(router.segments);
			query.textContent = JSON.stringify(
				Object.fromEntries(router.query.entries()),
			);
		}
	}

	start(document.body, app);

	const eventPath =
		document.body.querySelector<HTMLParagraphElement>("#eventPath");
	const segments =
		document.body.querySelector<HTMLParagraphElement>("#segments");
	const query = document.body.querySelector<HTMLParagraphElement>("#query");

	// biome-ignore lint/style/noNonNullAssertion: test
	document.body.querySelector("input")!.value = "/foo";
	document.body.querySelector("button")?.click();

	await new Promise((resolve) => setTimeout(resolve, 10));

	expect(eventPath?.textContent).toStrictEqual("/foo");
	expect(JSON.parse(segments?.textContent || "")).toStrictEqual(["foo"]);
	expect(JSON.parse(query?.textContent || "")).toStrictEqual({});

	// biome-ignore lint/style/noNonNullAssertion: test
	document.body.querySelector("input")!.value = "/bar";
	document.body.querySelector("button")?.click();
	await new Promise((resolve) => setTimeout(resolve, 10));

	expect(eventPath?.textContent).toStrictEqual("/bar");
	expect(JSON.parse(segments?.textContent || "")).toStrictEqual(["bar"]);
	expect(JSON.parse(query?.textContent || "")).toStrictEqual({});

	// biome-ignore lint/style/noNonNullAssertion: test
	document.body.querySelector("input")!.value = "/foo/bar/baz/pippo/pluto";
	document.body.querySelector("button")?.click();
	await new Promise((resolve) => setTimeout(resolve, 10));

	expect(eventPath?.textContent).toStrictEqual("/foo/bar/baz/pippo/pluto");
	expect(JSON.parse(segments?.textContent || "")).toStrictEqual([
		"foo",
		"bar",
		"baz",
		"pippo",
		"pluto",
	]);
	expect(JSON.parse(query?.textContent || "")).toStrictEqual({});

	// biome-ignore lint/style/noNonNullAssertion: test
	document.body.querySelector("input")!.value = "/foo?bar=baz&pippo=pluto";
	document.body.querySelector("button")?.click();
	await new Promise((resolve) => setTimeout(resolve, 10));

	expect(eventPath?.textContent).toStrictEqual("/foo?bar=baz&pippo=pluto");
	expect(JSON.parse(segments?.textContent || "")).toStrictEqual(["foo"]);
	expect(JSON.parse(query?.textContent || "")).toStrictEqual({
		bar: "baz",
		pippo: "pluto",
	});
});
