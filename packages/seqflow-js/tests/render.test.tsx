import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";
import { type Log, type SeqflowFunctionContext, start } from "../src/index";

test("render simple button", async () => {
	async function App(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(`<button type="button">${data.text}</button>`);
	}

	start(
		document.body,
		App,
		{
			text: "increment",
		},
		{},
	);
	expect(document.body.innerHTML).toBe(
		'<button type="button">increment</button>',
	);
});

test("render simple button with jsx", async () => {
	async function App(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);
	}

	start(
		document.body,
		App,
		{
			text: "increment",
		},
		{},
	);
	expect(document.body.innerHTML).toBe(
		'<button type="button">increment</button>',
	);
});

test("render - fragment", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<>
				<span>first</span>
			</>,
		);
	}

	start(document.body, App, undefined, {});
	expect(document.body.innerHTML).toBe("<span>first</span>");
});

test("render - component in fragment", async () => {
	async function Button(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);
	}
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<>
				<Button text="bnt" />
			</>,
		);
	}

	start(document.body, App, undefined, {});
	expect(document.body.innerHTML).toBe(
		'<div><button type="button">bnt</button></div>',
	);
});

test("render a direct nested component button with jsx", async () => {
	async function Button(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);
	}
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(<Button text="increment" />);
	}

	start(document.body, App, undefined, {});
	expect(document.body.innerHTML).toBe(
		'<div><button type="button">increment</button></div>',
	);
});

test("render a indirect nested component button with jsx", async () => {
	async function Button(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);
	}
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<div>
				<Button text="increment" />
			</div>,
		);
	}

	start(document.body, App, undefined, {});
	expect(document.body.innerHTML).toBe(
		'<div><div><button type="button">increment</button></div></div>',
	);
});

test("render a component with children", async () => {
	async function MyDiv(
		this: SeqflowFunctionContext,
		data: JSX.IntrinsicAttributes,
	) {
		this.renderSync(<div>{data.children}</div>);
	}
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<MyDiv>
				<button type="button">increment</button>
			</MyDiv>,
		);
	}

	start(document.body, App, undefined, {});
	expect(document.body.innerHTML).toBe(
		'<div><div><button type="button">increment</button></div></div>',
	);
});

test("render plain nested jsx", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<div>
				<span>
					<div>
						<span>
							<div>
								<button type="button">increment</button>
							</div>
						</span>
					</div>
				</span>
			</div>,
		);
	}

	start(document.body, App, undefined, {});
	expect(document.body.innerHTML).toBe(
		'<div><span><div><span><div><button type="button">increment</button></div></span></div></span></div>',
	);
});

test("re-render plain nested jsx", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(<span>first</span>);
		await new Promise((resolve) => setTimeout(resolve, 100));
		this.renderSync(<span>second</span>);
		await new Promise((resolve) => setTimeout(resolve, 100));
		this.renderSync(<span>third</span>);
	}

	start(document.body, App, undefined, {});
	await screen.findByText(/first/i);
	await screen.findByText(/second/i);
	await screen.findByText(/third/i);
});

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
