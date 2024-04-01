## From where I started

As a developer, I worked with many technologies, mainly on the backend.
While familiar with it, I started working with the front-end ones. I was fascinated by the diversity of the frameworks and libraries we have to build our applications. 

I started using Angular and React and have used them for many years. Anyway, every time I tried to build something more complex, the frameworks and libraries introduced a lot of complexity and cognitive stress. Instead of focusing on the business logic, I had to focus on using the framework or the library. I didn't realize or understand that my confusion had been transformed into frustration.

It took me a while to understand it, but I realized that the existing frameworks and libraries are only sometimes the best solution for the problem I have to solve. I realized that the main products I must build are digital products, like websites and web applications, where the users land on it only after authentication, and the stakeholder focuses on the user experience.
Narrowing my focus on those types of products, I started to think about what I liked and didn't like about the frontend world:
- While my code organization at the back-end follows a domain-driven design, my front-end code is structured differently. Consequently, the code is organized in a way that is only sometimes clear about the purpose of the code: no framework or library suggested anything on this topic.
- SSR, SSG, ISC, and other techniques are helpful. The main project I followed was related to a website under a login where the SEO is optional. Instead, the HTTP JSON Rest API was requested to be exposed, the same as the front-end uses. So, full-stack technologies aren't valuable for this use case.
- Node.js and similar technologies have become famous because the development team can use the same language on both sides: the team can share code between the front-end and back-end, like validation. Anyway, the portion of the shared code could be higher in terms of how the state management, components, and events are handled by the frameworks.

I have also tried different frameworks but have yet to find someone to resolve all my dilemmas.

## What I was looking for

I appreciate the innovation and diversity of the frontend world, which brings me here: I want to look for a way to simplify my work, reduce the complexity, and use language features almost everywhere. I want to use a framework that helps me to build digital products, focused on simplifing the user experience improvement.

From this point, I started thinking about what I liked and didn't like about the front-end world.
The output of this thinking was the following list:
- The component-based architecture allows the UI to split into small, reusable, and independent pieces. It enables the team to build a design system and reuse the components across the application (and applications).
- The structure of the application logic follows the team logic without putting any constraint on it. So, the class, function, and enum usages are possible.
- The async/await usage is a way to handle the asynchronous code. In the past, the front-end code used callbacks after promises, but now, all browsers can use the async/await language feature.
- The Typescript support is a way to reduce errors and improve code quality. Even if only some people like it, it is an excellent tool to enhance the code quality and let other developers understand the code and contribute to it.
- The simplicity of integrating into other frameworks and supporting multiple versions on the same page without strange tricks.

## The solution I thought

So, starting from here, I try to build something new, keeping in mind the following key concepts:
- Simplicity over Complexity
- Events over State Management
- Linearity over Complex Abstractions
- Explicitness over Implicitiveness

With this in mind, I started to write the `SeqFlow` framework. The following are some decisions I will take to resolve my dilemma, considering the previous ones.

### Render component

I started to think about a way to simplify the component rendering, and I thought about the following requirements:
- The component should be a function, not a class. This is because the class introduces a lot of boilerplate code, and it is not always clear what the purpose of the class is.
- The component should easily process the asynchronous operations, like the data fetching, and the rendering should be updated when the data is available.
- A developer reads the component from top to bottom without jumping from the bottom to the top. This implies there's no re-rendering of the whole component when the state changes: if something changes, the code explicitly updates the rendered HTML.

From this list, I structured the component as an asynchronous function, where the developer can use the async/await syntax to handle the asynchronous operations.

```ts
import { ComponentParam } from "seqflow-js";

export async function MyComponent({ dom }: ComponentParam) {
    dom.render(\`<div>Loading...</div>\`);
    const data = await fetchData(); // async function
    dom.render(\`<pre><code>\${JSON.stringify(data), null, 2}</code></pre>\`);
}
```

Initially, SeqFlow didn't support JSX, but PRs are welcomed!

### No global injection

`SeqFlow` instance isn't installed globally. This means it lives where it is used, and it is not shared with other instances nor other libraries. This is a way to reduce the complexity when the application has to be integrated with other libraries and frameworks, like web components.

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

This allows the developer to stop the `SeqFlow` instance and free the resources when the application is not needed anymore.

### Event handlers

For historical reasons, the event handlers are defined as callbacks, which requires a different mindset to handle the asynchronous operations. The callbacks are not always easy to read because the code runs in a different order than what is written.

Moreover, callbacks are challenging to compose with other operations, such as data fetching. For this reason, `SeqFlow` introduces a new way to handle the event handlers using the async iterators.

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

The more the features are added, the more the complexity is introduced. To reduce the noise, `SeqFlow` uses the concept of domains. A domain is, shortly, a way to split the applications into parts, segregated by logic boundaries. Inside a domain, the application logic classes/functions are stored, and the components that refer to it are stored there: in this way, the code is structured into folders that match the business domains.

This structure reduces the complexity and the cognitive stress because if a feature is needed, the team knows where to implement it and how it interacts with the other domains.

In `SeqFlow`, the suggested structure is the following:

```
src/
    domains/
        domain1/
            components/
            Domain1.ts
            events.ts
            index.ts
        domain2/
            components/
            Domain2.ts
            events.ts
            index.ts
    ...
```

Suppose our application has the `User` domain. We can register the domain using the `start` function:
```ts
// src/index.ts
import { start } from "seqflow-js";
import { Main } from "./Main";
import { UserDomain } from "./src/domains/user";

start(document.getElementById("root"), Main, undefined, {
	domains: {
		user: (eventTarget) => {
			return new UserDomain(eventTarget);
		},
	},
});
```
And listen to the events of the domain:
```ts

function getBadge(user: User | undefined) {
    if (user) {
        return \`<div>\${user.name}</div>\`;
    } else {
        return \`<div>Guest</div>\`;
    }
}

export async function UserBadgeComponent({
	event,
	dom,
	domains,
	router,
}: ComponentParam) {
    const user: User | undefined = await domains.user.getLoggedUser();
    dom.render(\`<div>\${getBadge(user)}</div>\`);

    // Listen to the UserLoggedEvent
	const events = event.waitEvent(
		event.domainEvent(UserLoggedEvent),
	);
    // Every time the event is emitted, the \`for\` loop is executed
    for await (const ev of events) {
        const user: User | undefined = await domains.user.getUser()
        // Update the badge
        dom.render(\`<div>\${getBadge(user)}</div>\`);
    }
}
```

Now, the `UserBadgeComponent` is listening to the `UserLoggedEvent` event, and every time the event is emitted, the component automatically updates the badge.

The login form is in the `User` domain and emits the `UserLoggedEvent` event when the user logs in.

See the <a title="E-Commerce example in seqflow-js repository" target="_blank" href="https://github.com/allevo/seqflow-js/tree/main/examples/e-commerce">E-Commerce example</a> for more information about it. Even if `SeqFlow` doesn't match the E-Commerce use case, we developed it as an example to show how the structure is organized.

## Conclusion

`SeqFlow` is thouth to be a way to simplify the frontend development, reducing the complexity and the cognitive stress. 
In fact, leveraging on standards, the API shouldn't be so obscure.
