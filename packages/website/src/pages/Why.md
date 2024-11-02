## From where I started

As a developer, I worked with many technologies, mainly on the backend. While familiar with the backend, I started working with the front-end ones. I was fascinated by the diversity of the frameworks and libraries we use to build our applications.

I started using Angular and React and have used them for many years. Anyway, every time I tried to build something more complex, the frameworks and libraries introduced a lot of complexity and cognitive stress. Instead of focusing on the business logic, I used the framework or the library. I didn't realize or understand that my confusion had been transformed into frustration.

It took me a while to understand it, but I realized that the existing frameworks and libraries are only sometimes the best solution for the problem I have to solve. I realized that the main products I must build are digital products, like websites and web applications, where the users land on it only after authentication. The stakeholder focuses on the user experience. Narrowing my focus on those types of products, I started to think about what I liked and didn't like about the frontend world:
- While my code organization at the back end follows a domain-driven design, my front-end code is structured differently. Consequently, the code is organized in a way that is only sometimes clear about its purpose: no framework or library suggested anything on this topic.
- SSR, SSG, ISC, and other techniques are helpful. The main project I followed was related to a website under a login where SEO is not essential. Instead, the application exposes some Rest APIs that a front-end consumes, like a typical SPA. So, the mentioned technologies aren't valuable for this use case.
- Node.js and similar technologies have become famous because the development team can use the same language on both sides: the team can share code between the front-end and back-end. Anyway, the portion of the shared code could be higher: sharing little pieces of code like validation rules avoids code duplication and improves the quality of the product.

I have also tried different frameworks but have yet to find someone to resolve all my dilemmas.

## What I was looking for

I appreciate the innovation and diversity of the frontend world, which brings me here: I want to find a way to simplify my work, reduce complexity, and use language features almost everywhere. I want to use a framework that helps me build digital products focused on simplifying user experience improvement.

From this point, I started thinking about what I liked and didn't like about the front-end world. The output of this thinking was the following list:
- I like the component-based architecture, which allows the UI to split into small, reusable, and independent pieces. It enables the team to build a design system and reuse the components across the application (or applications).
- I prefer that the project structure of the application logic follows the team logic without putting any constraints on it. So, class, function, and enum usages are possible everywhere.
- I love the async/await usage: it is a way to handle the asynchronous code. In the past, the front-end code used callbacks after promises, but now, all browsers can use the async/await language feature.
- Typescript support reduces errors and improves code quality. Even if only some people like it, it is an excellent tool for enhancing code quality and helping other developers understand and contribute to it.
- The simplicity of integrating into other frameworks and supporting multiple versions on the same page without strange tricks.

## The solution I thought

So, starting from here, I try to build something new, keeping in mind the following key concepts:
- Simplicity over Complexity
- Events over State Management
- Linearity over Complex Abstractions
- Explicitness over Implicitiveness

With this in mind, I started to write the `SeqFlow` framework.

The following are some decisions I took and on which the framework is built.

### Render component

I started to think about a way to simplify the component rendering, and I thought about the following requirements:
- The component should be a function, not a class. This is because the class introduces a lot of boilerplate code, and it is not always clear which methods are invoked and when. Instead, the function exposes just one way to be invoked: the function invocation.
- The component should easily process asynchronous operations, like data fetching, and the rendering should be updated when the data is available.
- As a developer, I read the code from top to bottom without jumping from the bottom to the top. This should also be true for the front-end components. This implies there's no re-rendering of the whole component when the state changes: if something changes, the code explicitly updates the whole component or a part of it.

From this list, I structured components as asynchronous functions, where the developer can use the async/await syntax to handle the asynchronous operations.

```tsx
import { Contexts } from "@seqflow/seqflow";

export async function MyComponent({}, {component}: Contexts) {
    this.renderSync(<div>Loading...</div>);

    const userData: {
        username: string,
        name: string,
    } = await fetchUserData(); // async function

    component.renderSync(<p>Hi, {username}!</p>);
}
```

### Event handlers

For historical reasons, the event handlers are defined as callbacks, which requires a different mindset to handle the asynchronous operations. The callbacks are not always easy to read because the code runs in a different order than what is written: the code defines the function that will be executed when the event is emitted, and later, the code attaches the event handler to the event target.

Moreover, callbacks are challenging to compose with other sync operations, such as map and filter, and with async operations, such as data fetching. For this reason, `SeqFlow` converts the event handlers into async iterators, where the developer can use the async/await syntax to handle the events.

```tsx
import { Contexts } from "@seqflow/seqflow";

export async function Counter({}, {component}: Contexts) {
    let counter = 0;

	this.renderSync(<button>Click Me</button>);

	const events = component.waitEvents(component.domEvent(component._el, "click"));
	for await (const ev of events) {
		counter++;
        window.alert(\`Clicked \${counter} times\`);
	}
}
```

You can listen more events at the same time.

### Domains

The more the features are added, the more the complexity is introduced. To reduce the noise, `SeqFlow` uses the concept of domains. A domain is, shortly, a way to split the applications into parts, segregated by logic boundaries. Inside a domain, the application logic classes/functions are stored, and the components that refer to it are stored there: in this way, the code is structured into folders that match the business domains. For instance, the `AddProductToCart` component is stored in the `Cart` domain, and the `UserBadge` component is stored in the `User` domain.

This structure reduces the complexity and the cognitive stress because if a feature is needed, the team knows where to implement it and how it interacts with the other domains.

In `SeqFlow`, the suggested structure is the following:

```
src/
    domains/
        cart/
            components/
                AddProductToCart.tsx
            CartDomain.ts
            events.ts
            index.ts
        user/
            components/
                UserBadge.tsx
            UserDomain.ts
            events.ts
            index.ts
    ...
```

Suppose our application has the `User` domain. We can register the domain using the `start` function:
```ts
// src/index.ts
import { start } from "@seqflow/seqflow";
import { Main } from "./Main";
import { UserDomain } from "./src/domains/user";

start(document.getElementById("root"), Main, {}, {
	domains: {
		user: (eventTarget) => {
			return new UserDomain(eventTarget);
		},
	},
});
```
And listen to the events of the domain:
```tsx
function getBadge(user: User | undefined) {
    if (user) {
        return <div>{user.name}</div>;
    } else {
        return <div>Guest</div>;
    }
}

export async function UserBadge({}, { component, app }: Contexts) {
    const user: User | undefined = await app.domains.user.getLoggedUser();
    component.renderSync(<div>{getBadge(user)}</div>);

    // Listen to the UserLoggedEvent
	const events = component.waitEvents(
		component.app.domainEvent(UserLoggedEvent),
	);
    // Every time the event is emitted, the \`for\` loop is executed
    for await (const ev of events) {
        const user: User | undefined = await app.domains.user.getUser()
        // Update the badge
        component.renderSync(<div>{getBadge(user)}</div>);
    }
}
```

Now, the `UserBadge` is listening to the `UserLoggedEvent` event, and every time the event is emitted, the component automatically updates the badge.
So, when the user logged in, the login form emits the `UserLoggedEvent` event.

See the <a title="E-Commerce example in seqflow-js repository" target="_blank" href="https://github.com/allevo/seqflow-js/tree/main/examples/e-commerce">E-Commerce example</a> for more information about it.

NB: Even if `SeqFlow` doesn't match the E-Commerce use case due to the SEO optimization, it is still a good example because there are different domains to connect. We developed it as an example to show how the structure is organized.

### No global injection

`SeqFlow` instance isn't installed globally. This means it lives where it is used, and it is not shared with other instances of SeqFlow nor other libraries. This is a way to reduce the complexity when the application has to be integrated with other libraries and frameworks, like Custom Components.

```ts
import { start } from "@seqflow/seqflow";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, {}, {});
```

Moreover, the `SeqFlow` instance can be turned off using the `AbortController`:

```ts
import { start } from "@seqflow/seqflow";
import { Main } from "./Main";
import "./index.css";

const abortController = start(document.getElementById("root"), Main, {}, {});

abortController.abort("The application is not needed anymore");
```

This allows the developer to stop the `SeqFlow` instance and free the resources when the application is not needed anymore.

## Conclusion

`SeqFlow` is thouth to be a way to simplify the frontend development, reducing the complexity and the cognitive stress. 
In fact, leveraging on standards, the API shouldn't be so obscure.
