import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";
import {
	type SeqflowFunctionContext,
	type SeqflowFunctionData,
	start,
} from "../src/index";

test("dom event - increment", async () => {
	async function App(this: SeqflowFunctionContext) {
		const button = <button type="button">increment</button>;
		let counter = 0;
		const counterSpan: HTMLSpanElement = <span>{counter}</span>;
		this.renderSync(
			<div>
				{button}
				{counterSpan}
			</div>,
		);

		const events = this.waitEvents(
			this.domEvent("click", {
				el: button,
			}),
		);
		for await (const _ of events) {
			counter += 1;
			counterSpan.textContent = `${counter}`;
		}
	}

	start(document.body, App, {}, {});

	await screen.findByText(/0/i);
	(await screen.findByText(/increment/i)).click();
	await screen.findByText(/1/i);
	(await screen.findByText(/increment/i)).click();
	await screen.findByText(/2/i);
	(await screen.findByText(/increment/i)).click();
	await screen.findByText(/3/i);

	for (let i = 0; i < 10; i++) {
		(await screen.findByText(/increment/i)).click();
	}
	await screen.findByText(/13/i);
});

test("dom event - counter", async () => {
	async function App(this: SeqflowFunctionContext) {
		const incrementButton = <button type="button">increment</button>;
		const decrementButton = <button type="button">decrement</button>;
		let counter = 0;
		const counterSpan: HTMLSpanElement = <span>{counter}</span>;
		this.renderSync(
			<div>
				{incrementButton}
				{counterSpan}
				{decrementButton}
			</div>,
		);

		const events = this.waitEvents(
			this.domEvent("click", { el: this._el as HTMLElement }),
		);
		for await (const event of events) {
			if (decrementButton.contains(event.target as Node)) {
				counter -= 1;
			} else if (incrementButton.contains(event.target as Node)) {
				counter += 1;
			}
			counterSpan.textContent = `${counter}`;
		}
	}

	start(document.body, App, {}, {});

	await screen.findByText(/0/i);
	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();

	await screen.findByText(/3/i);
	(await screen.findByText(/decrement/i)).click();
	await screen.findByText(/2/i);
});

test("dom event - multiple", async () => {
	async function App(this: SeqflowFunctionContext) {
		const incrementButton = <button type="button">increment</button>;
		const decrementButton = <button type="button">decrement</button>;
		let counter = 0;
		const counterSpan: HTMLSpanElement = <span>{counter}</span>;
		this.renderSync(
			<div>
				{incrementButton}
				{counterSpan}
				{decrementButton}
			</div>,
		);

		const events = this.waitEvents(
			this.domEvent("click", { el: incrementButton }),
			this.domEvent("click", { el: decrementButton }),
		);
		for await (const event of events) {
			if (decrementButton.contains(event.target as Node)) {
				counter -= 1;
			} else if (incrementButton.contains(event.target as Node)) {
				counter += 1;
			}
			counterSpan.textContent = `${counter}`;
		}
	}

	start(document.body, App, {}, {});

	await screen.findByText(/0/i);
	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();

	await screen.findByText(/3/i);
	(await screen.findByText(/decrement/i)).click();
	await screen.findByText(/2/i);
});

test("dom event - multiple - different event type", async () => {
	async function App(this: SeqflowFunctionContext) {
		const incrementButton = <button type="button">increment</button>;
		const decrementButton = <button type="button">decrement</button>;
		let counter = 0;
		const counterSpan: HTMLSpanElement = <span>{counter}</span>;
		this.renderSync(
			<div>
				{incrementButton}
				{counterSpan}
				{decrementButton}
			</div>,
		);

		const events = this.waitEvents(
			this.domEvent("click", { el: incrementButton }),
			this.domEvent("focus", { el: decrementButton }),
		);
		for await (const event of events) {
			if (decrementButton.contains(event.target as Node)) {
				counter -= 1;
			} else if (incrementButton.contains(event.target as Node)) {
				counter += 1;
			}
			counterSpan.textContent = `${counter}`;
		}
	}

	start(document.body, App, {}, {});

	await screen.findByText(/0/i);
	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();

	await screen.findByText(/3/i);
	(await screen.findByText(/decrement/i)).focus();
	await screen.findByText(/2/i);
});

test("dom event - stop listen on unmount", async () => {
	async function App(this: SeqflowFunctionContext) {
		const next1Button = <button type="button">go to 1</button>;
		this.renderSync(<div>{next1Button}</div>);
		const events1 = this.waitEvents(
			this.domEvent("click", { el: next1Button }),
		);
		for await (const _ of events1) {
			// do nothing
			break;
		}

		const next2Button = <button type="button">go to 2</button>;
		this.renderSync(<div>{next2Button}</div>);
		// This event async generator should end when the component is unmounted
		for await (const _ of events1) {
		}

		const events2 = this.waitEvents(
			this.domEvent("click", { el: next2Button }),
		);
		for await (const _ of events2) {
			// do nothing
			break;
		}

		this.renderSync(<div>end</div>);

		// This event async generator should end when the component is unmounted
		for await (const _ of events2) {
		}
	}

	start(document.body, App, {}, {});
	(await screen.findByText(/go to 1/i)).click();
	(await screen.findByText(/go to 2/i)).click();
	await screen.findByText(/end/i);
});

test("child component can be used to listen", async () => {
	let counter = 0;

	async function Button(
		this: SeqflowFunctionContext,
		data: SeqflowFunctionData<{ text: string }>,
	) {
		this.renderSync(<button type="button">{data.text}</button>);
	}

	async function App(this: SeqflowFunctionContext) {
		const incrementButton = <Button text="Increment" />;
		const decrementButton = <Button text="Decrement" />;
		const counterDiv = <div>{counter}</div>;
		this.renderSync(
			<>
				<div>
					{decrementButton}
					{incrementButton}
				</div>
				{counterDiv}
			</>,
		);

		const events = this.waitEvents(
			this.domEvent("click", { el: this._el as HTMLElement }),
		);
		for await (const ev of events) {
			if (!(ev.target instanceof HTMLElement)) {
				continue;
			}
			if (incrementButton.contains(ev.target)) {
				counter++;
			} else if (decrementButton.contains(ev.target)) {
				counter--;
			}

			counterDiv.textContent = `${counter}`;
		}
	}

	start(document.body, App, undefined, {});

	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();

	await waitFor(() => expect(counter).toBe(3));
});

test("uses `key`", async () => {
	let counter = 0;

	async function Button(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);
	}

	async function App(this: SeqflowFunctionContext) {
		const counterDiv = <div>{counter}</div>;
		this.renderSync(
			<>
				<div>
					<Button key="decrement-button" text="Decrement" />
					<Button key="increment-button" text="Increment" />
				</div>
				{counterDiv}
			</>,
		);

		const events = this.waitEvents(
			this.domEvent("click", "decrement-button"),
			this.domEvent("click", "increment-button"),
		);
		for await (const ev of events) {
			if (!(ev.target instanceof HTMLElement)) {
				continue;
			}
			if (this.getChild("increment-button").contains(ev.target)) {
				counter++;
			} else if (this.getChild("decrement-button").contains(ev.target)) {
				counter--;
			}

			counterDiv.textContent = `${counter}`;
		}
	}

	start(document.body, App, undefined, {});

	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();
	(await screen.findByText(/increment/i)).click();

	await waitFor(() => expect(counter).toBe(3));
});

test("onClick on element", async () => {
	async function App(this: SeqflowFunctionContext) {
		let counter = 0;

		const changeCounter = (amount: number) => {
			return () => {
				counter += amount;
				this.getChild("counter").innerHTML = `${counter}`;
			};
		};
		const replaceWrapper = () => {
			this.replaceChild("wrapper", () => <div />);
		};
		this.renderSync(
			<>
				<div key="wrapper">
					<button type="button" onClick={changeCounter(-1)}>
						Decrement
					</button>
					<button type="button" onClick={changeCounter(1)}>
						Increment
					</button>
				</div>
				<div key="counter">{counter}</div>
				<button type="button" onClick={replaceWrapper}>
					Replace Child
				</button>
			</>,
		);
	}

	start(document.body, App, undefined, {});

	const incrementButton = await screen.findByRole("button", {
		name: /increment/i,
	});

	incrementButton.click();
	incrementButton.click();
	incrementButton.click();

	// Wait for the counter to be updated
	await screen.findByText(/3/i);

	const decrementButton = await screen.findByRole("button", {
		name: /decrement/i,
	});

	decrementButton.click();

	await screen.findByText(/2/i);

	(await screen.findByRole("button", { name: /replace child/i })).click();

	for (let i = 0; i < 10; i++) {
		incrementButton.click();
	}
	await new Promise((resolve) => setTimeout(resolve, 100));
	await screen.findByText(/2/i);
});

test("onClick on component", async () => {
	async function Button(this: SeqflowFunctionContext, data: { text: string }) {
		this.renderSync(<button type="button">{data.text}</button>);
	}

	async function App(this: SeqflowFunctionContext) {
		let counter = 0;

		const changeCounter = (amount: number) => {
			return () => {
				counter += amount;
				this.getChild("counter").innerHTML = `${counter}`;
			};
		};
		const replaceWrapper = () => {
			this.replaceChild("wrapper", () => <div />);
		};
		this.renderSync(
			<>
				<div key="wrapper">
					<Button onClick={changeCounter(-1)} text="Decrement" />
					<Button onClick={changeCounter(1)} text="Increment" />
				</div>
				<div key="counter">{counter}</div>
				<button type="button" onClick={replaceWrapper}>
					Replace Child
				</button>
			</>,
		);
	}

	start(document.body, App, undefined, {});

	const incrementButton = await screen.findByRole("button", {
		name: /increment/i,
	});

	incrementButton.click();
	incrementButton.click();
	incrementButton.click();

	// Wait for the counter to be updated
	await screen.findByText(/3/i);

	const decrementButton = await screen.findByRole("button", {
		name: /decrement/i,
	});

	decrementButton.click();

	await screen.findByText(/2/i);

	(await screen.findByRole("button", { name: /replace child/i })).click();

	for (let i = 0; i < 10; i++) {
		incrementButton.click();
	}

	await new Promise((resolve) => setTimeout(resolve, 100));
	await screen.findByText(/2/i);
});
