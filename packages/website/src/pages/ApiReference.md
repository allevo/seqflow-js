## start

This function starts `SeqFlow` and renders the component into the DOM element.

```ts
function start<
        Component extends SeqflowFunction<FirstComponentData>,
        FirstComponentData extends JSX.IntrinsicAttributes
>(
        root: HTMLElement,
        firstComponent: Component,
        componentOption: FirstComponentData | undefined,
        seqflowConfiguration: Partial<SeqflowConfiguration>
): AbortController;
```

### Parameters

- `root: HTMLElement` - The DOM element where the component will be rendered.
- `firstComponent: Component` - The SeqFlow component function.
- `componentOption: FirstComponentData | undefined` - The initial state of the component or undefined.
- `seqflowConfiguration?: Partial<SeqflowConfiguration>` - The configuration of the `SeqFlow` instance.
     - `info: (l: Log) => void; error: (l: Log) => void; debug: (l: Log) => void;` - The log functions to be used internally. No logs are printed if this function is not provided. The application can use this function to log the messages too.
     - `domains` - The object that let you to create the custom domains. Empty object by default.
     - `config` - The application configuration object.
     - `router` - The router object that contains the navigation methods. By default, the router object will be a `BrowserRouter` instance.

### Returns

- `AbortController` - The `AbortController` instance that can be used to stop the whole `SeqFlow` instance.

## ComponentFn

The component function is an asynchronous function that renders the component into the DOM element.

```ts
type SeqflowFunction<T extends JSX.IntrinsicAttributes> = (
        this: SeqflowFunctionContext,
        data: T
) => Promise<void>;
```

### Parameters

- `this: SeqflowFunctionContext` - The context object that contains the methods to render the component.
- `param: T` - The component data parameter object.

## SeqflowFunctionContext

This interface is the parameter object that is passed to the component function.

### Fields

- `app: Readonly<SeqflowAppContext>` - The SeqFlow app instance. It contains the context of the application, such as the custom domains, the router object.
- `abortController: AbortController` - The instance of the `AborteController` linked to the component.
- `renderSync: (html: string | JSX.Element) => void` - This method renders the HTML string or JSX element into the component mounting DOM element.
- `waitEvents: <Fns extends EventAsyncGenerator<GetYieldType<Fns[number]>>[]>(...fns: Fns) => AsyncGenerator<GetYieldType<Fns[number]>>` - The method to wait for multiple events to be triggered.
- `domEvent: <K extends keyof HTMLElementEventMap>(eventType: K, options) => EventAsyncGenerator<HTMLElementEventMap[K]>` - The method to create an async generator that waits for the DOM event to be triggered. The `options` object can be used to customize the event listener and to prevent the default behavior.
- `domainEvent<BEE extends typeof DomainsPackage.DomainEvent<unknown>>(domainEventClass: BEE): EventAsyncGenerator<InstanceType<BEE>>` - The method to create an async generator that waits for the domain event to be triggered.
- `navigationEvent(): EventAsyncGenerator<NavigationEvent>` - The method to create an async generator that waits for the navigation event to be triggered.
- `replaceChild: (key: string, newChild: () => JSX.Element | Promise<JSX.Element>) => void` - The method to replace a child component with the same `key` with a new component.
- `_el: HTMLElement` - The DOM element where the component is mounted.
- `createDOMElement` - The method to create a DOM element. Don't use this method directly.
- `createDOMFragment` - The method to create a Fragment DOM element. Don't use this method directly.

## Domains

This interface is the object that contains the custom domains you created using `start` function.
This interface is empty by default and you can add your custom domains. See the <a target="_blank" href="https://github.com/allevo/seqflow-js/tree/main/examples/e-commerce">E-commerce example</a>

## Router

This interface is the object that contains the navigation methods.

### Properties

- `navigate: (path: string) => void` - The method to navigate to the given path.
- `segments: string[]` - The array of the segments of the current path.
- `back(): void` - Perform the back action.
- `install(): void` - This method is used internally to install the router.
- `getEventTarget(): EventTarget` - This method is used internally to get the event target.
