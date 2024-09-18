import { afterEach, beforeEach, expect, test } from "vitest";
import {
	type ComponentProps,
	type Contexts,
	SeqFlowComponentContext,
} from "../../src/index";

let component: SeqFlowComponentContext;
let abortController: AbortController;
let logs = []
beforeEach(() => {
	document.body.innerHTML = "";
	abortController = new AbortController();
	component = new SeqFlowComponentContext(document.body, abortController, {
		log: {
			debug: (...args: any[]) => logs.push(args),
			error: (...args: any[]) => logs.push(args),
		},
	},);
});
afterEach(() => {
	abortController.abort();
});

test("render: text", async () => {
	component.renderSync("foo");

	expect(document.body.innerHTML).toBe("foo");
});
test("render: text encoded", async () => {
	component.renderSync("<div></div>");

	expect(document.body.innerHTML).toBe("&lt;div&gt;&lt;/div&gt;");
});
test("render: child", async () => {
	component.renderSync(<div />);

	expect(document.body.innerHTML).toBe("<div></div>");
});
test("render: child child", async () => {
	component.renderSync(
		<div>
			<div />
		</div>,
	);

	expect(document.body.innerHTML).toBe("<div><div></div></div>");
});
test('render: "data-*" properties are forwarded to div', async () => {
	component.renderSync(<div data-foo="bar" />);

	expect(document.body.innerHTML).toBe('<div data-foo="bar"></div>');
});
test("render: className can be string or array of string", async () => {
	component.renderSync(<div className={"foo bar"} />);
	expect(document.body.innerHTML).toBe('<div class="foo bar"></div>');

	component.renderSync(<div className={["foo", "bar"]} />);
	expect(document.body.innerHTML).toBe('<div class="foo bar"></div>');
});
test("render: htmlFor is string", async () => {
	component.renderSync(<label htmlFor="foo_bar" />);
	expect(document.body.innerHTML).toBe('<label for="foo_bar"></label>');
});
test("render: style can be string or object", async () => {
	component.renderSync(<div style={"background: red;"} />);
	expect(document.body.innerHTML).toBe('<div style="background: red;"></div>');

	component.renderSync(<div style={{ background: "red" }} />);
	expect(document.body.innerHTML).toBe('<div style="background: red;"></div>');
});
test("render: fragment", async () => {
	component.renderSync(
		<>
			<div />
		</>,
	);
	expect(document.body.innerHTML).toBe("<div></div>");
});
test("render: component", async () => {
	async function MyComponent(
		_: ComponentProps<unknown>,
		{ component, app }: Contexts,
	) {
		component.renderSync("foo");
	}

	component.renderSync(<MyComponent />);

	expect(document.body.innerHTML).toBe("<div>foo</div>");
});

test("render: number", async () => {
	component.renderSync(4);

	expect(document.body.innerHTML).toBe("4");
});
test("render: child number", async () => {
	component.renderSync(<div>{4}</div>);

	expect(document.body.innerHTML).toBe("<div>4</div>");
});
test("render: undefined", async () => {
	component.renderSync(undefined);

	expect(document.body.innerHTML).toBe("");
});
test("render: child undefined", async () => {
	component.renderSync(<div>{undefined}</div>);

	expect(document.body.innerHTML).toBe("<div></div>");
});
test("render: object", async () => {
	// @ts-ignore
	component.renderSync({ foo: "bar" });

	expect(document.body.innerHTML).toBe("");
});
test("render: child object", async () => {
	// @ts-ignore
	component.renderSync(<div>{{ foo: "bar" }}</div>);

	expect(document.body.innerHTML).toBe("<div></div>");
});
test("render: fragment", async () => {
	component.renderSync(<>{4}</>);

	expect(document.body.innerHTML).toBe("4");
});

test("render: svg", async () => {
	component.renderSync(
		<svg:svg>
			{ /* @ts-ignore */ }
			<svg:path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></svg:path>
		</svg:svg>
	);

	const svg = document.querySelector("svg");
	expect(svg).not.instanceOf(HTMLElement);
	expect(svg).instanceOf(SVGElement);
});

test("render: math", async () => {
	component.renderSync(
		<math:math>
			<math:mfrac>
				<math:msup>
					<math:mi>π</math:mi>
					<math:mn>2</math:mn>
				</math:msup>
				<math:mn>6</math:mn>
			</math:mfrac>
		</math:math>
	);

	const math = document.querySelector("math");
	expect(math).not.instanceOf(HTMLElement);
	// This should be MathMLElement, but it's not available in JSDOM :(
	expect(math).instanceOf(Element);
});
test("render: unknown namespace math", async () => {
	expect(() => {
		// @ts-ignore
		<foo:foo />
	}).toThrowError("Unknown namespace: foo");
});
test("render: wrong symbol", async () => {
	expect(() => {
		component.createDOMElement(Symbol("foo"), null);
	}).toThrowError("Unrecognize symbol: expected only createDOMFragment symbol");
});

test("render: attr null & underfined", async () => {
	component.renderSync(<div data-1={'1'} data-null={null} data-undefined={undefined} />);

	expect(document.body.innerHTML).toBe('<div data-1="1"></div>');
});
test("render: attr bool", async () => {
	component.renderSync(<div data-1={'1'} data-true={true} data-false={false} />);

	expect(document.body.innerHTML).toBe('<div data-1="1" data-true=""></div>');
});
test("render: attr number", async () => {
	component.renderSync(<div data-1={'1'} data-0={0} data-10={10} data-20={-20} />);

	expect(document.body.innerHTML).toBe('<div data-1="1" data-0="0" data-10="10" data-20="-20"></div>');
});
test("render: fn", async () => {
	component.renderSync(<div data-1={'1'} data-fn={() => {}} />);

	expect(document.body.innerHTML).toBe('<div data-1="1"></div>');
});
test("render: symbol", async () => {
	component.renderSync(<div data-1={'1'} data-symbol={Symbol.for('foo')} />);

	expect(document.body.innerHTML).toBe('<div data-1="1"></div>');
});

test("render: sync throw", async () => {
	function MyComponent() {
		throw new Error("foo");
	}
	component.renderSync(<MyComponent />);

	expect(document.body.innerHTML).toBe('<div></div>');
});
test("render: async throw", async () => {
	async function MyComponent() {
		throw new Error("foo");
	}
	component.renderSync(<MyComponent />);

	expect(document.body.innerHTML).toBe('<div></div>');
});
test("render: {} throw", async () => {
	expect(() => {
		component.createDOMElement({} as any, null);
	}).toThrowError("Unknown type");
});
