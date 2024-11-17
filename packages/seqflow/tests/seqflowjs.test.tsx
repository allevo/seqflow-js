import { screen, waitFor } from "@testing-library/dom";
import { beforeEach, expect, test } from "vitest";
import type { ComponentProps, Contexts } from "../src/index";
import { CounterChangedEvent, sleep, startTestApp } from "./test-utils";

beforeEach(() => {
	document.body.innerHTML = "";
});

test("the application starts", async (testContext) => {
	let invokedCounter = 0;
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		invokedCounter++;
		component.renderSync(<div>App</div>);
	}
	startTestApp(testContext, App);

	await waitFor(() =>
		expect(document.body.innerHTML).toBe(
			'<div data-global-key="3"><div>App</div></div>',
		),
	);
	expect(invokedCounter).toBe(1);
});

test("render child", async (testContext) => {
	async function Child(_: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<div>Child</div>);
	}
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<Child />);
	}
	startTestApp(testContext, App);

	await waitFor(() =>
		expect(document.body.innerHTML).contains("<div>Child</div>"),
	);
});

test("pass props to child", async (testContext) => {
	async function Child(
		{ text }: ComponentProps<{ text: string }>,
		{ component }: Contexts,
	) {
		component.renderSync(<div>{text}</div>);
	}
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<Child text="From parent" />);
	}
	startTestApp(testContext, App);

	await waitFor(() =>
		expect(document.body.innerHTML).contain("<div>From parent</div>"),
	);
});

test("listen dom throws on DocumentFragment", async (testContext) => {
	async function App(_: ComponentProps<unknown>, { component }: Contexts) {
		const incrementButton = (
			<>
				<button type="button">Increment</button>
			</>
		);

		component.renderSync(incrementButton);

		await expect(async () => {
			await component
				.domEvent(
					incrementButton,
					"click",
				)(new AbortController())
				.next();
		}).rejects.toThrowError("Cannot attach event to DocumentFragment");

		component.renderSync("Ok");
	}
	startTestApp(testContext, App);

	await waitFor(() => expect(document.body.innerHTML).contain("Ok"));
});

test("listen dom event using key", async (testContext) => {
	async function Counter(_: ComponentProps<unknown>, { component }: Contexts) {
		let counter = 0;
		component.renderSync(
			<div>
				<button key="button" type="button">
					Increment
				</button>
				<span key="counter">Counter: 0</span>
			</div>,
		);

		const counterSpan = component.getChild("counter");
		const events = component.waitEvents(component.domEvent("button", "click"));
		for await (const _ of events) {
			counter += 1;
			counterSpan.textContent = `Counter: ${counter.toString()}`;
		}
	}
	startTestApp(testContext, Counter);

	const incrementButton = await screen.findByRole("button");

	incrementButton.click();

	await waitFor(() => screen.getByText("Counter: 1"));

	incrementButton.click();

	await waitFor(() => screen.getByText("Counter: 2"));
});

test("listen dom event using element", async (testContext) => {
	async function Counter(_: ComponentProps<unknown>, { component }: Contexts) {
		let counter = 0;

		const incrementButton = <button type="button">Increment</button>;

		component.renderSync(
			<div>
				{incrementButton}
				<span key="counter">Counter: 0</span>
			</div>,
		);

		const counterSpan = component.getChild("counter");
		const events = component.waitEvents(
			component.domEvent(incrementButton, "click"),
		);
		for await (const _ of events) {
			counter += 1;
			counterSpan.textContent = `Counter: ${counter.toString()}`;
		}
	}
	startTestApp(testContext, Counter);

	const incrementButton = await screen.findByRole("button");

	incrementButton.click();

	await waitFor(() => screen.getByText("Counter: 1"));

	incrementButton.click();

	await waitFor(() => screen.getByText("Counter: 2"));
});

test("listen more dom events", async (testContext) => {
	async function Counter(_: ComponentProps<unknown>, { component }: Contexts) {
		let counter = 0;

		component.renderSync(
			<div>
				<button key="button1" type="button">
					Button1
				</button>
				<button key="button2" type="button">
					Button2
				</button>
				<button key="button3" type="button">
					Button3
				</button>
				<span key="counter">Counter: 0</span>
			</div>,
		);

		const counterSpan = component.getChild("counter");
		const events = component.waitEvents(
			component.domEvent("button1", "click"),
			component.domEvent("button2", "click"),
			component.domEvent("button3", "click"),
		);
		for await (const _ of events) {
			counter += 1;
			counterSpan.textContent = `Counter: ${counter.toString()}`;
		}
	}

	startTestApp(testContext, Counter);

	const button1 = await screen.findByText(/button1/i);
	const button2 = await screen.findByText(/button2/i);
	const button3 = await screen.findByText(/button3/i);

	button1.click();

	await waitFor(() => screen.getByText("Counter: 1"));

	button2.click();

	await waitFor(() => screen.getByText("Counter: 2"));

	button3.click();

	await waitFor(() => screen.getByText("Counter: 3"));
});

test("switch on who fire event", async (testContext) => {
	async function Counter(_: ComponentProps<unknown>, { component }: Contexts) {
		let counter = 0;

		component.renderSync(
			<div>
				<button key="increase-by-1" type="button">
					Increase by 1
				</button>
				<button key="increase-by-2" type="button">
					Increase by 2
				</button>
				<button key="increase-by-3" type="button">
					Increase by 3
				</button>
				<span key="counter">Counter: 0</span>
			</div>,
		);

		const counterSpan = component.getChild("counter");
		const events = component.waitEvents(
			component.domEvent("increase-by-1", "click"),
			component.domEvent("increase-by-2", "click"),
			component.domEvent("increase-by-3", "click"),
		);
		const increase1Button = component.getChild("increase-by-1");
		const increase2Button = component.getChild("increase-by-2");
		const increase3Button = component.getChild("increase-by-3");
		for await (const ev of events) {
			if (!(ev.target instanceof Element)) {
				continue;
			}

			switch (true) {
				case increase1Button.contains(ev.target):
					counter += 1;
					break;
				case increase2Button.contains(ev.target):
					counter += 2;
					break;
				case increase3Button.contains(ev.target):
					counter += 3;
					break;
			}

			counterSpan.textContent = `Counter: ${counter.toString()}`;
		}
	}

	startTestApp(testContext, Counter);

	const increase1Button = await screen.findByText(/Increase by 1/i);
	const increase2Button = await screen.findByText(/Increase by 2/i);
	const increase3Button = await screen.findByText(/Increase by 3/i);

	increase1Button.click();

	await waitFor(() => screen.getByText("Counter: 1"));

	increase2Button.click();

	await waitFor(() => screen.getByText("Counter: 3"));

	increase3Button.click();

	await waitFor(() => screen.getByText("Counter: 6"));
});

test("prevent default", async (testContext) => {
	async function Counter(_: ComponentProps<unknown>, { component }: Contexts) {
		let counter = 0;

		component.renderSync(
			<form key="increment-form">
				<span key="counter">Counter: 0</span>
				<button key="submit-button" type="submit">
					Submit
				</button>
			</form>,
		);

		const counterSpan = component.getChild("counter");
		const events = component.waitEvents(
			component.domEvent("submit-button", "click", { preventDefault: true }),
			component.domEvent("increment-form", "submit"),
		);
		for await (const ev of events) {
			if (ev instanceof SubmitEvent) {
				// this is never triggered because the "click" event is prevented
				throw new Error("Kaboom");
			}
			counter += 1;
			counterSpan.textContent = `Counter: ${counter.toString()}`;
		}
	}

	startTestApp(testContext, Counter);

	const submitButton = await screen.findByText("Submit");

	submitButton.click();

	await waitFor(() => screen.getByText("Counter: 1"));

	submitButton.click();

	await waitFor(() => screen.getByText("Counter: 2"));
});

test("stop propagation", async (testContext) => {
	async function Counter(_: ComponentProps<unknown>, { component }: Contexts) {
		let counter = 0;

		component.renderSync(
			<div key="wrapper">
				<button key="button" type="button">
					Click me
				</button>
				<span key="counter">Counter: 0</span>
			</div>,
		);

		const counterSpan = component.getChild("counter");
		const events = component.waitEvents(
			component.domEvent("button", "click", { stopPropagation: true }),
			component.domEvent("button", "click"),
			component.domEvent("wrapper", "click"),
		);
		for await (const _ of events) {
			counter += 1;
			counterSpan.textContent = `Counter: ${counter.toString()}`;
		}
	}

	startTestApp(testContext, Counter);

	const button = await screen.findByText("Click me");

	button.click();

	await waitFor(() => screen.getByText("Counter: 2"));

	button.click();

	await waitFor(() => screen.getByText("Counter: 4"));

	await sleep(100);

	await waitFor(() => screen.getByText("Counter: 4"));
});

test("stop immediate propagation", async (testContext) => {
	async function Counter(_: ComponentProps<unknown>, { component }: Contexts) {
		let counter = 0;

		component.renderSync(
			<div key="wrapper">
				<button key="button" type="button">
					Click me
				</button>
				<span key="counter">Counter: 0</span>
			</div>,
		);

		const counterSpan = component.getChild("counter");
		const events = component.waitEvents(
			component.domEvent("button", "click"),
			component.domEvent("button", "click", { stopImmediatePropagation: true }),
			component.domEvent("button", "click"),
			component.domEvent("wrapper", "click"),
		);
		for await (const _ of events) {
			counter += 1;
			counterSpan.textContent = `Counter: ${counter.toString()}`;
		}
	}

	startTestApp(testContext, Counter);

	const button = await screen.findByText("Click me");

	button.click();

	await waitFor(() => screen.getByText("Counter: 2"));

	button.click();

	await waitFor(() => screen.getByText("Counter: 4"));

	await sleep(100);

	await waitFor(() => screen.getByText("Counter: 4"));
});

test("listen domain event", async (testContext) => {
	async function IncrementCounterButton(
		_: ComponentProps<unknown>,
		{ component, app }: Contexts,
	) {
		component.renderSync(
			<button key="button" type="button">
				Increment
			</button>,
		);

		const events = component.waitEvents(component.domEvent("button", "click"));
		for await (const _ of events) {
			app.domains.counter.applyDelta(1);
		}
	}
	async function Counter(
		_: ComponentProps<unknown>,
		{ component, app }: Contexts,
	) {
		component.renderSync(
			<div>
				<IncrementCounterButton />
				<span key="counter">Counter: 0</span>
			</div>,
		);

		const counterSpan = component.getChild("counter");
		const events = component.waitEvents(
			component.domainEvent(CounterChangedEvent),
		);
		for await (const _ of events) {
			counterSpan.textContent = `Counter: ${app.domains.counter.getCount()}`;
		}
	}
	startTestApp(testContext, Counter);

	const incrementButton = await screen.findByRole("button");

	incrementButton.click();

	await waitFor(() => screen.getByText("Counter: 1"));

	incrementButton.click();

	await waitFor(() => screen.getByText("Counter: 2"));
});

test("listen navigation event", async (testContext) => {
	async function AnotherPageLink(
		_: ComponentProps<unknown>,
		{ component, app }: Contexts,
	) {
		component.renderSync(<a href="/another-page">Go to another page</a>);

		const events = component.waitEvents(
			component.domEvent(component._el, "click", { preventDefault: true }),
		);
		for await (const _ of events) {
			app.router.navigate("/another-page");
		}
	}
	async function App(_: ComponentProps<unknown>, { component, app }: Contexts) {
		component.renderSync(
			<div>
				<AnotherPageLink />
				<span key="current-path">Path: {app.router.getCurrentPathname()}</span>
			</div>,
		);

		const counterSpan = component.getChild("current-path");
		const events = component.waitEvents(component.navigationEvent());
		for await (const ev of events) {
			counterSpan.textContent = `Path: ${ev.path}`;
		}
	}

	startTestApp(testContext, App);

	await waitFor(() => screen.getByText("Path: /"));

	const navigationLink = await screen.findByRole("link");

	navigationLink.click();

	await waitFor(() => screen.getByText("Path: /another-page"));
});
