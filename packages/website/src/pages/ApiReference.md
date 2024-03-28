## start

This function starts `SeqFlow` and renders the component into the DOM element.

```ts
function start<T>(
	el: HTMLElement,
	fn: ComponentFn<T>,
	option?: ChildOption<T>,
	config?: Partial<StartParameters>,
): AbortController;
```

### Parameters

- `el: HTMLElement` - The DOM element where the component will be rendered.
- `fn: ComponentFn<T>` - The component function to be rendered.
- `option?: ChildOption<T>` - The initial state of the component.
- `config?: Partial<StartParameters>` - The configuration of the `SeqFlow` instance.
  - `log: (l: Log) => void` - The log function to be used internally. No logs are printed if this function is not provided.
  - `domains` - The object that let you to create the custom domains. Empty object by default.
  - `navigationEventBus` - The event bus for the navigation events. An `EventTarget` instance is used by default.
  - `config` - The application configuration object.

### Returns

- `AbortController` - The `AbortController` instance that can be used to stop the whole `SeqFlow` instance.

## ComponentFn

The component function is an asynchronous function that renders the component into the DOM element.

```ts
type ComponentFn<T = unknown> = (
	param: ComponentParam<T>,
) => Promise<void>;
```

### Parameters

- `param: ComponentParam<T>` - The component parameter object.


## ComponentParam<T>

This interface is the parameter object that is passed to the component function.

### Fields

- `data: T` - The data object that is passed to the component. This is where application data is placed.
- `domains: Domains` - The object that contains the custom domains you created using `start` function.
- `signal: AbortSignal` - The `AbortSignal` instance that can be used to stop operation in the component. For instance you can use this signar in the `fetch` function to stop the request if in the meanwhile the component is unmounted.
- `router: Router` - The router object that contains the navigation methods.
- `dom: Dom` - The DOM object that contains the methods to render the component.
- `event: Event` - The event object that contains the methods to handle the events.

## Domains

This interface is the object that contains the custom domains you created using `start` function.
This interface is empty by default and you can add your custom domains.

## Router

This interface is the object that contains the navigation methods.

### Properties

- `navigate: (url: string) => void` - The method to navigate to the given URL.
- `segments: string[]` - The array of the segments of the current URL.
- `query: Map<string, string>` - A map that contains the parameters of the current URL.

## Dom

This interface is the object that contains the methods to render the component.

### Properties

- `render: (html: string) => void` - The method to render the HTML string into the DOM element.
- `querySelector<E = HTMLElement>(selector: string): E` - The method to query the DOM element by the given selector. This method is a wrapper of the `querySelector` method of the DOM element.
- `querySelectorAll<E extends Node = Node>(selector): NodeListOf<E>` - The method to query all the DOM elements by the given selector. This method is a wrapper of the `querySelectorAll` method of the DOM element.
- `child(id: string, fn: ComponentFn<unknown>): void` - The method to render the child component into the DOM element. The `id` is the unique identifier of the child component.
- `child<E>(id: string, fn: ComponentFn<E>, option: ChildOption<E>): void` - The method to render the child component into the DOM element with the initial state. The `id` is the unique identifier of the child component.

## Event

This interface is the object that contains the methods to handle the events.

### Properties

- `domainEvent<BEE extends typeof DomainEvent<unknown>>(b: BEE, ):AbortableAsyncGenerator<InstanceType<BEE>>` - The method to create an async generator that waits for the DOM event to be triggered.
- `domEvent<K extends keyof HTMLElementEventMap>( type: K, option?: Partial<DomEventOption>, ): AbortableAsyncGenerator<Event>;` - The method to create an async generator that waits for the DOM event to be triggered. A custom option can be passed to the method to customize the event listener.
- `navigationEvent():  AbortableAsyncGenerator<Event>;` - The method to create an async generator that waits for the navigation event to be triggered.
- `waitEvent<T extends Event[]>(...fns: { [I in keyof T]: AbortableAsyncGenerator<T[I]> } ): AsyncGenerator<T[number]>;` - The method combines multiple async generators into one. The method generates the events from the first generator that is triggered.
- `		dispatchDomainEvent<D, BE extends DomainEvent<D> = DomainEvent<D>>(event: BE);` - The method to dispatch the domain event to the event bus.
