## From where I started

As a developer, I worked with many technologies, from the backend to the frontend.
Meanwhile, I was familiarized with the backend technologies, started to work with the frontend ones, and was fascinated by the diversity of the frameworks and libraries we have to build our applications. Those differences are not always easy to manage and introduce some complexity. Virtual DOM, signals, and observers are promising technologies, but sometimes they are more challenging to understand and use.

This complexity was highlighted when I (and my team) had to build web pages that the user could access only after a login.

Moreover, I didn't use the Javascript/Typescript language at its best: I didn't use the latest features, like classes, async/await, async iterators, and others that simplify the code a lot. Instead, they are replaced with libraries like ngrx, redux, and others that introduce much boilerplate code and complexity.

That means that I had to study a lot of different libraries and frameworks to understand what I was doing. And this creates confusion and cognitive stress in me.

## What I was looking for

I appreciate the innovation and diversity of the frontend world, which brings me here: I want to look for a way to simplify my work, reduce the complexity, and use language features almost everywhere.

From this point, I started thinking about what I liked and didn't like about the front-end world.
The output of this thinking was the following list:
- The component-based architecture allows the UI to split into small, reusable, and independent pieces. It is also the way to build a design system.
- The class usage to define application logic is a way to organize the code and explain the application logic.
- The async/await usage is a way to handle the asynchronous code. In the past, we used callbacks, then promises, and now async/await. I want to use the latest features of the language.
- The Typescript support is a way to reduce errors and improve code quality. Even if only some people like it, it is an excellent tool to enhance the code quality and let other developers understand the code and contribute to it.
- The simplicity of integrating into other frameworks and supporting multiple versions on the same page without strange tricks.

## The solution I thought

So, starting from here, I try to build something new, keeping in mind the following key concepts:
- Events over State Management
- Simplicity over Complexity
- Linearity over Complex Abstractions
- Explicitness over Implicitiveness

With this in mind, I started to write the `SeqFlow` framework. The following are some reasons for the design.

### Render component

I started to think about a way to simplify the component rendering, and I thought about the following requirements:
- The component should be a function, not a class. This is because the class introduces a lot of boilerplate code, and it is not always clear what the purpose of the class is.
- The component should be able to process the asynchronous operations, like the data fetching, and the rendering should be updated when the data is available.
- The component read should be made from top to bottom without re-rendering the whole component when the state changes. If something changes, the component changes only the part that needs to be updated.

From this list, I structured the component as an asynchronous function, where the developer can use the async/await syntax to handle the asynchronous operations.

```ts
import { ComponentParam } from "seqflow-js";

export async function MyComponent({ dom }: ComponentParam) {
    dom.render(\`<div>Loading...</div>\`);
    const data = await fetchData(); // async function
    dom.render(\`<pre><code>\${JSON.stringify(data), null, 2}</code></pre>\`);
}
```

Initially, SeqFlow didn't support JSX, but a PR is welcome!

### No global injection

`SeqFlow` instance isn't installed globally. This means it lives where it is used, and it is not shared with other instances nor other libraries. This is a way to reduce the complexity.

```ts
import { start } from "seqflow-js";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main);
```

Moreover, the `SeqFlow` instance can be turned off using the `AbortController`:
    
```ts
import { start } from "seqflow-js";
import { Main } from "./Main";
import "./index.css";

const abortController = start(document.getElementById("root"), Main);

abortController.abort("test");
```

This allows the developer to stop the `SeqFlow` instance and free the resources when the application is not needed anymore. This also facilitates the integration with other libraries and frameworks and web components.

### Event handlers

For historical reasons, the event handlers are defined as callbacks, which requires a different mindset to handle the asynchronous operations. The callbacks are not always easy to understand, they are not always easy to test, they are not always easy to maintain. Moreover, the callbacks are not always easy to compose with other operations, like the data fetching. For this reason, `SeqFlow` introduces a new way to handle the event handlers using the async iterators.

```ts
import { ComponentParam } from "seqflow-js";

export async function Counter({ dom, event }: ComponentParam) {
    let counter = 0;
	dom.render(\`<button>Click Me</button>\`);

	const events = event.waitEvent(event.domEvent("click"));
	for await (const ev of events) {
		counter++;
        window.alert(\`Clicked \${counter} times\`);
	}
}
```

You can listen more events at the same time, see the [API reference](/api-reference) for more information about it.

### Domains

The more the features are added, the more the complexity is introduced. To reduce the complexity, `SeqFlow` introduces the concept of domains. A domain is a way to group the components and the event handlers, and it is a way to reduce the complexity and the cognitive stress. The domain is a way to organize the code and the application logic.

So, the application code is organized into folders, one for each domain. Each folder contains the components relative to that domain, and classes to handle the application logic.

See the <a target="_blank" href="https://github.com/allevo/seqflow-js/tree/main/examples/e-commerce">E-Commerce example</a> for more information about it.

## Conclusion

`SeqFlow` is thouth to be a way to simplify the frontend development, reducing the complexity and the cognitive stress. 
In fact, leveraging on standards, the API shouldn't be so obscure.
