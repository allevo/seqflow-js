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
		const a = <Button text="bnt" />;
		this.renderSync(a);
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
	async function MyDiv(this: SeqflowFunctionContext, { children }: JSX.ARG) {
		this.renderSync(<div>{children}</div>);
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

test("class & className", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<>
				<div className="foo" />
			</>,
		);
	}

	start(document.body, App, undefined, {});

	expect(document.body.innerHTML).toBe('<div class="foo"></div>');
});

test("style as string", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<>
				<div style="display: none" />
			</>,
		);
	}

	start(document.body, App, undefined, {});

	expect(document.body.innerHTML).toBe('<div style="display: none"></div>');
});

test("style as CSSStyleDeclaration", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<>
				<div style={{ display: "none" }} />
			</>,
		);
	}

	start(document.body, App, undefined, {});

	expect(document.body.innerHTML).toBe('<div style="display: none;"></div>');
});

test("getChild", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.renderSync(
			<>
				<div key="key1" />
				<div key="key2">
					<div key="key3" />
				</div>
			</>,
		);

		this.getChild("key1").innerHTML = "key1";
		this.getChild("key3").appendChild(document.createTextNode("key4"));
		this.getChild("key3").innerHTML = "key3";
	}
	start(document.body, App, undefined, {});

	await new Promise((resolve) => setTimeout(resolve, 100));

	expect(document.body.innerHTML).toBe(
		'<div key="key1">key1</div><div key="key2"><div key="key3">key3</div></div>',
	);
});
