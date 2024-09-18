import { screen, waitFor } from "@testing-library/dom";
import { afterEach, beforeEach, expect, test } from "vitest";
import { ComponentProps, Contexts, SeqFlowComponentContext } from "../../src/index";
import { sleep } from "../test-utils";

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

test("child: findChild", () => {
	component.renderSync(<div key="div1" />);
	expect(document.body.innerHTML).toBe('<div key="div1"></div>');

	const a = document.querySelector("div[key=div1]");
	const aa = component.findChild("div1");
	expect(aa).toBe(a);

	expect(component.findChild("foo")).toBe(null);
});
test("child: getChild", () => {
	component.renderSync(<div key="div1" />);
	expect(document.body.innerHTML).toBe('<div key="div1"></div>');

	const a = document.querySelector("div[key=div1]");
	const aa = component.getChild("div1");
	expect(aa).toBe(a);

	expect(() => component.getChild("foo")).toThrow();
});
test("child: replaceChild", async () => {
	component.renderSync(<div key="div1">A</div>);
	expect(document.body.innerHTML).toBe('<div key="div1">A</div>');

    await component.replaceChild('div1', () => <div key="div1">B</div>);
    expect(document.body.innerHTML).toBe('<div key="div1">B</div>');
});
test("child: replaceChild - not found", async () => {
	component.renderSync(<div key="div1">A</div>);
	expect(document.body.innerHTML).toBe('<div key="div1">A</div>');

	expect(async () => component.replaceChild('foo', () => <div key="div1">B</div>)).rejects.toThrow();
});
test("child: replaceChild - async", async () => {
	component.renderSync(<div key="div1">A</div>);
	expect(document.body.innerHTML).toBe('<div key="div1">A</div>');

	await component.replaceChild('div1', async () => {
		return <div key="div1">B</div>
	})
	expect(document.body.innerHTML).toBe('<div key="div1">B</div>');
});
test("child: render children", async () => {
	function MyComponent({ children }: ComponentProps<unknown>, { component }: Contexts) {
		component._el.setAttribute('parent', 'true');
		component.renderSync(<div data-foo="bar">{children}</div>);
	}
	component.renderSync(
		<div><MyComponent><div key="div1">A</div></MyComponent></div>
	);
	expect(document.body.innerHTML).toBe('<div><div parent="true"><div data-foo="bar"><div key="div1">A</div></div></div></div>');
});

test("child: replaceChild should unmount all the current components and their listeners", async () => {
	function MyComponent1({ children }: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<div data-component="my-component-1">{children}</div>);
	}
	function MyComponent2({ children }: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<div data-component="my-component-2">{children}</div>);
	}

	let counter = 0
	function incrementCounter() {
		counter++;
	}

	component.renderSync(
		<MyComponent1 key="spot">
			<div onClick={incrementCounter}>Click me</div>
		</MyComponent1>
	);
	expect(document.body.innerHTML).toBe('<div><div data-component="my-component-1"><div>Click me</div></div></div>');

	const firstDiv = await screen.findByText(/Click me/i);

	firstDiv.click();
	await waitFor(() => expect(counter).toBe(1));

	component.replaceChild(
		'spot',
		() => <MyComponent2 key="spot">
			<div onClick={incrementCounter}>Click me</div>
		</MyComponent2>
	);

	// The child is unmounted
	// so the onClick event is not triggered
	firstDiv.click();
	await sleep(100);
	expect(counter).toBe(1);

	const secondDiv = await screen.findByText(/Click me/i);

	secondDiv.click();
	await waitFor(() => expect(counter).toBe(2));
});

test("child: renderSync should unmount all the current components and their listeners", async () => {
	function MyComponent1({ children }: ComponentProps<unknown>, { component }: Contexts) {
		component.renderSync(<div data-component="my-component-1">{children}</div>);
	}

	let counter = 0
	function incrementCounter() {
		counter++;
	}

	component.renderSync(
		<MyComponent1 key="spot">
			<div onClick={incrementCounter}>Click me</div>
		</MyComponent1>
	);
	expect(document.body.innerHTML).toBe('<div><div data-component="my-component-1"><div>Click me</div></div></div>');

	const firstDiv = await screen.findByText(/Click me/i);

	firstDiv.click();
	await waitFor(() => expect(counter).toBe(1));

	component.renderSync(
		<div>Replace the whole content</div>
	);

	firstDiv.click();
	await sleep(100);
	expect(counter).toBe(1);
});
