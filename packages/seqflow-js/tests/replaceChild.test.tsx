import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";
import { type Log, type SeqflowFunctionContext, start } from "../src/index";

/*
test("replace a child", async () => {
	const texts = ["first", "second", "third"];
	async function Button(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);
	}
	async function App(this: SeqflowFunctionContext) {
		const text = texts.shift();
		if (!text) {
			throw new Error("no text");
		}
		this.renderSync(
			<div id="1">
				<Button key="aa" text={text} />
			</div>,
		);

		const events = this.waitEvents(this.domEvent("click", { el: this._el }));
		for await (const _ of events) {
			const nextText = texts.shift();
			if (!nextText) {
				break;
			}
			this.replaceChild("aa", async () => <Button key="aa" text={nextText} />);
		}
	}

	start(document.body, App, undefined, {});
	const firstButton = await screen.findByText(/first/i);
	firstButton.click();
	const secondButton = await screen.findByText(/second/i);
	secondButton.click();
	const thirdButton = await screen.findByText(/third/i);
	thirdButton.click();

	await waitFor(() =>
		expect(document.body.innerHTML).toBe(
			'<div id="1"><div><button type="button">third</button></div></div>',
		),
	);
});

test("replace a child - stop listen", async () => {
	let counter = 0;
	async function Button1(this: SeqflowFunctionContext) {
		this.renderSync(<button type="button">button1</button>);
		const events = this.waitEvents(this.domEvent("click", { el: this._el }));
		for await (const _ of events) {
			counter++;
		}
	}
	async function Button2(this: SeqflowFunctionContext) {
		this.renderSync(<button type="button">button2</button>);
	}
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<div>
				<Button1 key="aa" />
			</div>,
		);

		const events = this.waitEvents(this.domEvent("click", { el: this._el }));
		for await (const _ of events) {
			this.replaceChild("aa", async () => <Button2 key="aa" />);
			break;
		}
	}

	start(document.body, App, undefined, {});

	// Click button1, just to see if it's working
	const firstButton = await screen.findByText(/button1/i);
	firstButton.click();
	await waitFor(() => expect(counter).toBe(1));

	// Click button2, is displayed
	await screen.findByText(/button2/i);

	// If I click button1 again, it should not increment the counter
	firstButton.click();
	firstButton.click();
	await new Promise((resolve) => setTimeout(resolve, 100));
	await waitFor(() => expect(counter).toBe(1));
});

test("replace a child - html element", async () => {
	async function Button(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);
	}
	async function App(this: SeqflowFunctionContext) {
		let counter = 0;
		this.renderSync(
			<div>
				<div key="content">{counter++}</div>
				<Button text={"click me"} />
			</div>,
		);

		const events = this.waitEvents(this.domEvent("click", { el: this._el }));
		for await (const _ of events) {
			this.replaceChild("content", async () => (
				<div key="content">{counter++}</div>
			));
		}
	}

	start(document.body, App, undefined, {});

	const button = await screen.findByText(/click me/i);

	await waitFor(() =>
		expect(document.body.innerHTML).toBe(
			'<div><div key="content">0</div><div><button type="button">click me</button></div></div>',
		),
	);

	button.click();

	await waitFor(() =>
		expect(document.body.innerHTML).toBe(
			'<div><div key="content">1</div><div><button type="button">click me</button></div></div>',
		),
	);

	button.click();

	await waitFor(() =>
		expect(document.body.innerHTML).toBe(
			'<div><div key="content">2</div><div><button type="button">click me</button></div></div>',
		),
	);
});
*/

test("replace a child - should unmount child components", async () => {
	let counter = 0
	async function Button(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);

		const events = this.waitEvents(this.domEvent("click", { el: this._el }));
		for await (const _ of events) {
			counter++;
		}
	}
	async function App(this: SeqflowFunctionContext) {
		const button = <Button text="click me" />;
		this.renderSync(
			<div>
				<div key="content" >{button}</div>
			</div>,
		);

		const events = this.waitEvents(this.domEvent("click", { el: button }));
		for await (const _ of events) {
			this.replaceChild("content", async () => (
				<div key="content">No button here</div>
			));
		}
	}

	start(document.body, App, undefined, {});

	const button = await screen.findByText(/click me/i);

	await waitFor(() =>
		expect(document.body.innerHTML).toBe(
			'<div><div key="content"><div><button type="button">click me</button></div></div></div>',
		),
	)
	expect(counter).toBe(0);

	button.click();

	await waitFor(() =>
		expect(document.body.innerHTML).toBe(
			'<div><div key="content">No button here</div></div>',
		),
	)
	expect(counter).toBe(1);

	for (let i = 0; i < 10; i++) {
		button.click();
	}

	await new Promise((resolve) => setTimeout(resolve, 40));

	// Button should not increment counter
	expect(counter).toBe(1);
});
