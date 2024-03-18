## Getting started
Welcome to SeqFlow documentation!

Here you can find the basic concept of the framework and how it can help your development. If you looking for a deep analysis about the reason, there's a dedicated page [here](/why "the reason of SeqFlow").

:::card:::
What you will learn:
- How to create a new project
- A simple application: the counter
- Create different components
- Structure your project into domains
- How to test your application
:::end-card:::

Are you looking for more complex examples? Check the <a target="_blank" href="https://github.com/allevo/seqflow-js/tree/main/examples">examples</a> folder at GitHub.

## Project creation
The first step to start a new project is to create it using the CLI. The command is:
```sh
pnpm create seqflow@latest --template empty
```

This command will ask you some questions about the project, like where to place the project.

For the purpose of this documentation, we will use the empty template, but you can choose another one running the previous command without `--template empty` argument.


Opening the project folder, you may see some files and folders. The most important are:


- `src/Main.ts`: the parent component
- `src/index.ts`: the entrypoint file
- `src/index.html`: the main HTML file
- `src/index.css`: the main CSS file

- `package.json`: the dependencies and devDependencies are fulfilled
- `biome.json`: the project formatter configuration
- `vite.config.js`: the Vite configuration file
- `vitest.config.ts`: the Vitest configuration file. We will talk about it later

For now, we will focus only on `src/Main.ts` file. Our first application will be a simple counter. Let's start by creating the component.


## Counter application

The counter application is a simple application that increments and decrements a number. We will create a unique component for this application that shows two buttons and a number: one button for incrementing the number and another for decrementing it.<br />So, our desiderata is to create 2 buttons and wait for a "click" event on each one: when the user clicks on a button, the number should be incremented or decremented accordingly.<br />It is simple.

Change the `src/Main.ts` file content as the following:

```ts
import { ComponentParam } from "seqflow-js";

export async function Main({ dom, event }: ComponentParam) {
	let counter = 0;
	dom.render(\`
<div>
	<button id="decrement">Decrement</button>
	<button id="increment">Increment</button>
</div>
<div id="counter">\${counter}</div>\`);

	const incrementButton = dom.querySelector("#increment");
	const decrementButton = dom.querySelector("#decrement");
	const counterDiv = dom.querySelector("#counter");

	const events = event.waitEvent(
		event.domEvent("click")
	);
	for await (const ev of events) {
		if (ev.target === incrementButton) {
			counter++;
		} else if (ev.target === decrementButton) {
			counter--;
		}

		counterDiv.textContent = \`\${counter}\`;
	}
}

```

Wait... let's start the application and see the result. Run the command `pnpm dev`.<br />
Open your browser and go to [`http://localhost:5173`](http://localhost:5173 "localhost"). You should see the counter application running.

Let's see what we have done:
- We created a new component, `Main`, that is responsible for rendering the counter application. It is an `async` function that receives a `ComponentParam` object as a parameter. See the [API reference](/api-reference "Api Reference") for more information about the `ComponentParam` object.
- We define a variable that holds the state of the application: the `counter` variable.
- We use the `dom.render` method to render the html.
- We also use the `dom.querySelector` method to get the button elements and the counter wrapper element.
- We use the `event.waitEvent` method to wait for a `"click"` event. Due to the event bubbling, we can attach a single event handler. `event.waitEvent` returns an async iterator that yields the events.
- We use a `for await` loop to wait for the `"click"` event.
- When the user clicks, we check which is the target of the event: if it is the increment button, we increment the counter variable; if it is the decrement button, we decrement the counter variable.
- Finally, we update the counter wrapper element with the new value of the counter variable.

Is the code similar to what you expected? Well, YES! It is simple and easy to read and understand.

If you come from a React or Angular background, you may be asking yourself: "Where is the state?".<br />
The state is the `count` variable. It is a simple variable that holds the state of the application. When the state changes, the component updates the html accordingly. This is the basic concept of SeqFlow.

In SeqFlow, state is just a variable. You can use it as you want. You can use a simple variable, an object, or even a function. It is dependent on which kind of state you want to manage.

## Create different components

Even if the counter application is simple, it is not well-structured.
We have the entire application in a single component. It is not a good practice. We should split the application into different components.

Let's start by creating a component, `Counter`, that will be responsible for rendering the counter application. Change the `src/Main.ts` file content as the following:

```ts
import { ComponentParam } from "seqflow-js";

async function ChangeCounterButton({ dom, data }: ComponentParam<{ text: string }>) {
	dom.render(\`<button>\${data.text}</button>\`);
}

export async function Main({ dom, event }: ComponentParam) {
	let counter = 0;
	dom.render(\`
<div>
	<div id="decrement"></div>
	<div id="increment"></div>
</div>
<div id="counter">\${counter}</div>
\`);
	dom.child("decrement", ChangeCounterButton, { data: { text: "Decrement" } });
	dom.child("increment", ChangeCounterButton, { data: { text: "Increment" } });

	const incrementButton = dom.querySelector("#increment");
	const decrementButton = dom.querySelector("#decrement");
	const counterDiv = dom.querySelector("#counter");

	const events = event.waitEvent(event.domEvent("click"));
	for await (const ev of events) {
		if (incrementButton.contains(ev.target)) {
			counter++;
		} else if (decrementButton.contains(ev.target)) {
			counter--;
		}

		counterDiv.textContent = \`\${counter}\`;
	}
}
```

We created a new component, `ChangeCounterButton`, that is responsible for rendering a button. We also used the `dom.child` method to render the `ChangeCounterButton` component inside the `Main` component.

The `ChangeCounterButton` component receives a `ComponentParam` object as a parameter. We also used the `ComponentParam` generic type to define the type of the `data` property. We typed the `data` property as an object with a `text` property that is a string. So, inside the component, we can access the `text` property as a string.

We also changed the `Main` component to use the `ChangeCounterButton` component. We used the `dom.child` method to render the `ChangeCounterButton` component inside the `Main` component. We passed the `text` property to the `ChangeCounterButton` component.

Moreover, we changed the event handling to use the `contains` method to check if the target of the event is inside the button element.

## Structure your project into domains

The counter application is still not well-structured: we mixed the UI and the logic parts.<br />
When the application grows, it will be hard to maintain and test it. We should split the application into different parts: the UI part and the logic part.

Before we start, let's understood the concept of domain in SeqFlow. A domain is a part of the application that is responsible for a specific feature.<br />
In this example, we will create a domain for the counter application: the counter domain will be responsible for managing the state of the counter application, incrementing and decrementing the counter variable.<br />
We will also create a domain for the UI part of the counter application: the button that increments and decrements the counter variable.<br />
We create the `counter` domain and put it in the `src/domains/counter` folder.
Lets start by creating the `counter` domain class. Create the `src/domains/counter/index.ts` file with the folling content:

```ts
import { createDomainEventClass } from "seqflow-js";

export const CounterChanged = createDomainEventClass("counter", "changed");

export class CounterDomain {
	private counter: number;

	constructor(
		private eventTarget: EventTarget,
		private init = 0,
	) {
		this.counter = init;
	}

	applyDelta(delta: number) {
		this.counter += delta;
		this.eventTarget.dispatchEvent(
			new CounterChanged(null),
		);
	}

	get() {
		return this.counter;
	}
}
```

The `CounterDomain` class is a pure Javascript (Typescript) class that is responsible for managing the state of the counter application. It has a `counter` property that holds the state of the counter application. It also has a `applyDelta` method that is responsible for incrementing and decrementing the counter variable.<br />
Because the UI part should be notified when the state changes, we create a `CounterChanged` event class for that reason: after the counter variable changes, the `CounterDomain` class dispatches a `CounterChanged` event with the new value of the counter variable.<br />

NB: the `createDomainEventClass` function is a helper function that creates a new event class. It is a simple function that returns a new event class. See the [API reference](/api-reference "Api Reference") for more information about the `createDomainEventClass` function.

After creating the `counter` domain, we should register it updating the `src/index.ts` file content as the following:

```ts
import { start } from "seqflow-js";
import { CounterDomain } from "./domains/counter/index.ts";

import { Main } from "./Main";

start(document.getElementById("root"), Main, {
	domains: {
		counter: (eventTarget) => {
			return new CounterDomain(eventTarget);
		},
	},
});

// Helps typescript to understand the new domain
declare module "seqflow-js" {
	interface Domains {
		counter: CounterDomain;
	}
}

```
This update is necessary to register the `counter` domain. See the [API reference](/api-reference "Api Reference") for more information about the `start` function.

Now, it is the time to move the `ChangeCounterButton` component to the `src/domains/counter` folder. Create the `src/domains/counter/ChangeCounterButton.ts` file with the following content:

```ts
import { ComponentParam } from "seqflow-js";

export async function ChangeCounterButton({
	dom,
	event,
	domains,
	data,
}: ComponentParam<{ delta: number; text: string }>) {
	dom.render(\`<button type="button">\${data.text}</button>\`);
	const events = event.waitEvent(event.domEvent("click"));
	for await (const _ of events) {
		domains.counter.applyDelta(data.delta);
	}
}
```
We didn't change the `ChangeCounterButton` component too much:
- We added `delta` property to the `data` property. It is a number that represents the increment or decrement value.
- We used the `domains` property to access the `counter` domain. We used the `applyDelta` method to increment or decrement the counter variable.

Finally, we should update the `src/Main.ts` file content as the following:

```ts
import { ComponentParam } from "seqflow-js";
import {
	CounterChanged,
	CounterDomain,
	CounterReset,
	components,
} from "./domains/counter";

export async function Main({ dom, event, domains }: ComponentParam) {
	const counter = domains.counter.get();
	dom.render(\`
<div>
	<div id="decrement"></div>
	<div id="increment"></div>
</div>
<div id="counter">\${counter}</div>\`);
	dom.child("decrement", components.ChangeCounterButton, {
		data: { delta: -1, text: "Decrement" },
	});
	dom.child("increment", components.ChangeCounterButton, {
		data: { delta: 1, text: "Increment" },
	});

	const counterDiv = dom.querySelector("#counter");

	const events = event.waitEvent(
		event.domainEvent(CounterChanged),
	);
	for await (const ev of events) {
		counterDiv.textContent = \`\${domains.counter.get()}\`;
	}
}
```

In this update, we changed the `Main` component as the following:
- the component uses the `counter` domain to get the initial value of the counter
- the component renders the html and two `ChangeCounterButton`: one for decrementing the counter variable and another for incrementing it.
- the component uses the `event.waitEvent` method to wait for the `CounterChanged` event.
- when the `CounterChanged` event is dispatched, the component updates the counter wrapper element with the new value of the counter variable.

## How to test your application

Testing is an important part of the development process. It is a way to ensure that the application works as expected. In SeqFlow, testing is simple and easy. We use the `vitest` library to test the application.<br />
The project is already configured to use the `vitest` library. The configuration is in the `vitest.config.ts` file. You can run the tests using the `pnpm test` command.<br />

Due to the simple nature of the application, we will create a unique test. Create the `src/tests/index.test.ts` file with the following content:

```ts
import { screen, waitFor } from "@testing-library/dom";
import { start } from "seqflow-js";
import { expect, test } from "vitest";
import { Main } from "../src/Main";
import { CounterDomain } from "../src/domains/counter/index.ts";

test("should increment and decrement the counter", async () => {
	start(document.body, Main, {
		log() {},
		domains: {
			counter: (eventTarget) => {
				return new CounterDomain(eventTarget);
			},
		},
	});

	const incrementButton =
		await screen.findByText<HTMLButtonElement>("Increment");
	const decrementButton =
		await screen.findByText<HTMLButtonElement>("Decrement");
	const counterDiv = await screen.findByText<HTMLDivElement>("0");

	expect(counterDiv.textContent).toBe("0");

	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
	incrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("2"));
	decrementButton?.click();
	await waitFor(() => expect(counterDiv?.textContent).toBe("1"));
});
```

This test is simple: it starts the application and waits for the `Increment` and `Decrement` buttons to appear. Then, it clicks on the `Increment` button and waits for the counter variable to be incremented. It does the same for the `Decrement` button.

## Conclusion

In this tutorial, we learned how to create a simple counter application using SeqFlow. We also learned how to structure the application into different parts: the UI part and the logic part. We also learned how to test the application using the `vitest` library.

For more complex examples, check the <a target="_blank" href="https://github.com/allevo/seqflow-js/tree/main/examples">examples</a> folder at GitHub.