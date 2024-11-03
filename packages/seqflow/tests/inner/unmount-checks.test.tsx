import { waitFor } from "@testing-library/dom";
import { beforeEach, expect, test } from "vitest";
import type { ComponentProps, Contexts } from "../../src/index";
import type { SeqFlowPlugin } from "../../src/plugin";
import { sleep, startTestApp } from "../test-utils";

beforeEach(() => {
	document.body.innerHTML = "";
});

test("track component lifecycle", async (testContext) => {
	async function AsyncDiv(
		{ children }: ComponentProps<unknown>,
		{ component }: Contexts,
	) {
		component.renderSync(<div>{children}</div>);
	}
	function SyncDiv(
		{ children }: ComponentProps<unknown>,
		{ component }: Contexts,
	) {
		component.renderSync(<div>{children}</div>);
	}
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(
			<>
				<Button key="Button" label="Click me" />
				<AsyncDiv key="AsyncDiv">Async Div</AsyncDiv>
				<SyncDiv key="SyncDiv">Sync Div</SyncDiv>
			</>,
		);
	}

	const ev: any[] = [];
	const ac = startTestApp(
		testContext,
		App,
		{
			key: "App",
		},
		[trackComponentLifecycle(ev)],
	);

	await waitFor(() => {
		expect(document.body.innerHTML).contains("Async Div");
		expect(document.body.innerHTML).contains("Sync Div");
		expect(document.body.innerHTML).contains("Click me");
	});

	const componentCreatedNames = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => e.props.key);
	expect(componentCreatedNames).toEqual([
		"App",
		"Button",
		"AsyncDiv",
		"SyncDiv",
	]);

	const componentEndedNames = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => e.props.key);
	expect(componentEndedNames).toEqual([
		"SyncDiv",
		"AsyncDiv",
		// Button is not ended because it is waiting for an event
		// 'Button',
		"App",
	]);

	ac.abort();

	await sleep(100);

	const componentEndedNamesAfterAbort = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => e.props.key);
	expect(componentEndedNamesAfterAbort).toEqual([
		"SyncDiv",
		"AsyncDiv",
		"App",
		// Now Button is ended because the app is aborted
		"Button",
	]);
});

test("track component lifecycle: replaceChild direct child", async (testContext) => {
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		let c = 0;
		component.renderSync(
			<>
				<button key="button" type="button">
					Replace others
				</button>
				<Button key="Button" label={`btn${c}`} />
			</>,
		);

		const events = component.waitEvents(component.domEvent("button", "click"));
		for await (const _ of events) {
			c++;
			component.replaceChild("Button", () => (
				<Button key="Button" label={`btn${c}`} />
			));
		}
	}

	const ev: any[] = [];
	startTestApp(
		testContext,
		App,
		{
			key: "App",
		},
		[trackComponentLifecycle(ev)],
	);

	await waitFor(() => expect(document.body.innerHTML).contains("btn0"));

	const componentCreatedNames = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => e.props.key);
	expect(componentCreatedNames).toEqual(["App", "Button"]);

	const componentEndedNames = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => e.props.key);
	expect(componentEndedNames).toEqual([]);

	const button = document.querySelector("button")!;
	button.click();
	await waitFor(() => expect(document.body.innerHTML).contains("btn1"));

	await sleep(100);

	// App calls `replaceChild` to replace the Button component. So:
	// - we expect the Button component to be ended
	const componentEndedNamesAfterReplace = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => ({ key: e.props.key, label: e.props.label }));
	expect(componentEndedNamesAfterReplace).toEqual([
		{ key: "Button", label: "btn0" },
	]);
	// - we expect a new Button component is created
	const componentCreatedNamesAfterReplace = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => ({ key: e.props.key, label: e.props.label }));
	expect(componentCreatedNamesAfterReplace).toEqual([
		{ key: "App", label: undefined },
		{ key: "Button", label: "btn0" },
		{ key: "Button", label: "btn1" },
	]);
});

test("track component lifecycle: replaceChild nested in div / child", async (testContext) => {
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		let c = 0;
		component.renderSync(
			<>
				<button key="button" type="button">
					Replace others
				</button>
				<div>
					<Button key="Button" label={`btn${c}`} />
				</div>
			</>,
		);

		const events = component.waitEvents(component.domEvent("button", "click"));
		for await (const _ of events) {
			c++;
			component.replaceChild("Button", () => (
				<Button key="Button" label={`btn${c}`} />
			));
		}
	}

	const ev: any[] = [];
	startTestApp(
		testContext,
		App,
		{
			key: "App",
		},
		[trackComponentLifecycle(ev)],
	);

	await waitFor(() => expect(document.body.innerHTML).contains("btn0"));

	const componentCreatedNames = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => e.props.key);
	expect(componentCreatedNames).toEqual(["App", "Button"]);

	const componentEndedNames = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => e.props.key);
	expect(componentEndedNames).toEqual([]);

	const button = document.querySelector("button")!;
	button.click();
	await waitFor(() => expect(document.body.innerHTML).contains("btn1"));

	await sleep(100);

	// App calls `replaceChild` to replace the Button component. So:
	// - we expect the Button component to be ended
	const componentEndedNamesAfterReplace = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => ({ key: e.props.key, label: e.props.label }));
	expect(componentEndedNamesAfterReplace).toEqual([
		{ key: "Button", label: "btn0" },
	]);
	// - we expect a new Button component is created
	const componentCreatedNamesAfterReplace = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => ({ key: e.props.key, label: e.props.label }));
	expect(componentCreatedNamesAfterReplace).toEqual([
		{ key: "App", label: undefined },
		{ key: "Button", label: "btn0" },
		{ key: "Button", label: "btn1" },
	]);
});

test("track component lifecycle: replaceChild nested in div / wrapper", async (testContext) => {
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		let c = 0;
		component.renderSync(
			<>
				<button key="button" type="button">
					Replace others
				</button>
				<div key="wrapper">
					<Button key="Button" label={`btn${c}`} />
				</div>
			</>,
		);

		const events = component.waitEvents(component.domEvent("button", "click"));
		for await (const _ of events) {
			c++;
			component.replaceChild("wrapper", () => (
				<div key="wrapper">
					<Button key="Button" label={`btn${c}`} />
				</div>
			));
		}
	}

	const ev: any[] = [];
	startTestApp(
		testContext,
		App,
		{
			key: "App",
		},
		[trackComponentLifecycle(ev)],
	);

	await waitFor(() => expect(document.body.innerHTML).contains("btn0"));

	const componentCreatedNames = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => e.props.key);
	expect(componentCreatedNames).toEqual(["App", "Button"]);

	const componentEndedNames = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => e.props.key);
	expect(componentEndedNames).toEqual([]);

	const button = document.querySelector("button")!;
	button.click();
	await waitFor(() => expect(document.body.innerHTML).contains("btn1"));

	await sleep(100);

	// App calls `replaceChild` to replace the Button component. So:
	// - we expect the Button component to be ended
	const componentEndedNamesAfterReplace = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => ({ key: e.props.key, label: e.props.label }));
	expect(componentEndedNamesAfterReplace).toEqual([
		{ key: "Button", label: "btn0" },
	]);
	// - we expect a new Button component is created
	const componentCreatedNamesAfterReplace = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => ({ key: e.props.key, label: e.props.label }));
	expect(componentCreatedNamesAfterReplace).toEqual([
		{ key: "App", label: undefined },
		{ key: "Button", label: "btn0" },
		{ key: "Button", label: "btn1" },
	]);
});

test("track component lifecycle: replaceChild nested in div / nested component", async (testContext) => {
	/*
	 * We have this structure: App -> Nested -> Button
	 * If App replace Nested, we expect the Button component to be ended
	 */
	async function Nested(
		{ label }: ComponentProps<{ label: string }>,
		{ component }: Contexts,
	) {
		component.renderSync(<Button key="Button" label={label} />);

		const events = component.waitEvents(component.domEvent("Button", "click"));
		for await (const _ of events) {
		}

		throw new Error("This component should not be unmounted");
	}
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		let c = 0;
		component.renderSync(
			<>
				<button key="button" type="button">
					Replace others
				</button>
				<Nested key="Nested" label={`btn${c}`} />
			</>,
		);

		const events = component.waitEvents(component.domEvent("button", "click"));
		for await (const _ of events) {
			c++;
			component.replaceChild("Nested", () => (
				<Nested key="Nested" label={`btn${c}`} />
			));
		}
	}

	const ev: any[] = [];
	startTestApp(
		testContext,
		App,
		{
			key: "App",
		},
		[trackComponentLifecycle(ev)],
	);

	await waitFor(() => expect(document.body.innerHTML).contains("btn0"));

	const componentCreatedNames = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => e.props.key);
	expect(componentCreatedNames).toEqual(["App", "Nested", "Button"]);

	const componentEndedNames = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => e.props.key);
	expect(componentEndedNames).toEqual([]);

	const button = document.querySelector("button")!;
	button.click();
	await waitFor(() => expect(document.body.innerHTML).contains("btn1"));

	await sleep(100);

	const componentEndedNamesAfterReplace = ev
		.filter((e) => e.t === "onComponentEnded")
		.map((e) => ({ key: e.props.key, label: e.props.label }));
	expect(componentEndedNamesAfterReplace).toEqual([
		{ key: "Button", label: "btn0" },
		{ key: "Nested", label: "btn0" },
	]);
	const componentCreatedNamesAfterReplace = ev
		.filter((e) => e.t === "onComponentCreated")
		.map((e) => ({ key: e.props.key, label: e.props.label }));
	expect(componentCreatedNamesAfterReplace).toEqual([
		{ key: "App", label: undefined },
		{ key: "Nested", label: "btn0" },
		{ key: "Button", label: "btn0" },
		{ key: "Nested", label: "btn1" },
		{ key: "Button", label: "btn1" },
	]);
});

function trackComponentLifecycle(arr: any[]): SeqFlowPlugin {
	return {
		onComponentCreated(contexts, componentKeyPair, props) {
			arr.push({
				t: "onComponentCreated",
				contexts,
				componentKeyPair,
				props,
			});
		},
		onComponentEnded(contexts, componentKeyPair, props, result) {
			arr.push({
				t: "onComponentEnded",
				contexts,
				componentKeyPair,
				props,
				result,
			});
		},
		onDomainEventTargetsCreated(ets) {
			arr.push({
				t: "onDomainEventTargetsCreated",
				ets,
			});
		},
	};
}

async function Button(
	{ label }: ComponentProps<{ label: string }>,
	{ component, app }: Contexts,
) {
	component.renderSync(
		<button key="button" type="button">
			{label}
		</button>,
	);

	const events = component.waitEvents(component.domEvent("button", "click"));
	for await (const _ of events) {
		app.log.debug({
			message: "Button clicked",
		});
	}
}
