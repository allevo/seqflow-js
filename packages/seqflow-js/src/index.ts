import * as DomainsPackage from "./domains";
import { type EventAsyncGenerator, combineEvents } from "./events";
import {
	BrowserRouter,
	InMemoryRouter,
	NavigationEvent,
	type Router,
} from "./router";
import { domEvent, domainEvent, navigationEvent } from "./typedEvents";

export { BrowserRouter, type Router, NavigationEvent, InMemoryRouter };

// biome-ignore lint/suspicious/noEmptyInterface: This type is fulfilled by the user
export interface Domains {}

export type DomainEvent<T> = DomainsPackage.DomainEvent<T>;
export const createDomainEventClass = DomainsPackage.createDomainEventClass;

export interface Log {
	message: string;
	data?: unknown;
}
export interface LogFunction {
	info: (l: Log) => void;
	error: (l: Log) => void;
	debug: (l: Log) => void;
}

export interface SeqflowAppContext {
	log: LogFunction;
	domains: Domains;
	domainEventTargets: { [K in keyof Domains]: EventTarget };
	config: ApplicationConfiguration;
	router: Router;
}

type GetYieldType<A extends EventAsyncGenerator<unknown>> = Exclude<
	Awaited<ReturnType<ReturnType<A>["next"]>>,
	IteratorReturnResult<unknown>
>["value"];

export interface SeqflowFunctionContext {
	/**
	 * The application context
	 */
	app: Readonly<SeqflowAppContext>;
	/**
	 * The abort controller for this component
	 */
	abortController: AbortController;
	/**
	 * Render the HTML synchronously. It replaces the content of the component
	 *
	 * @param html the HTML to render as a string or a JSX element
	 * @returns
	 */
	renderSync: (html: string | JSX.Element) => void;
	/**
	 * Wait for multiple events to happen
	 *
	 * @param fns EventAsyncGenerator array
	 * @returns an async generator that yields the events
	 */
	waitEvents: <Fns extends EventAsyncGenerator<GetYieldType<Fns[number]>>[]>(
		...fns: Fns
	) => AsyncGenerator<GetYieldType<Fns[number]>>;
	/**
	 * Wait for a DOM event to happen
	 *
	 * @param eventType the event type
	 * @param options Options
	 * @param options.el the element to listen to. This could be `this._el` or a child element
	 * @param options.preventDefault if true, it calls `preventDefault` on the event. Default is false.
	 * @returns
	 */
	domEvent: <K extends keyof HTMLElementEventMap>(
		eventType: K,
		options: {
			el: HTMLElement;
			preventDefault?: boolean;
		},
	) => EventAsyncGenerator<HTMLElementEventMap[K]>;
	/**
	 * Wait for a domain event to happen
	 *
	 * @param domainEventClass the domain event class
	 */
	domainEvent<BEE extends typeof DomainsPackage.DomainEvent<unknown>>(
		domainEventClass: BEE,
	): EventAsyncGenerator<InstanceType<BEE>>;
	/**
	 * Wait for a navigation event to happen
	 */
	navigationEvent(): EventAsyncGenerator<NavigationEvent>;
	/**
	 * Replace a child component with a new one
	 *
	 * @param key the key of the child to replace
	 * @param newChild a function that returns a JSX element or a promise of a JSX element
	 * @returns
	 */
	replaceChild: (
		key: string,
		newChild: () => JSX.Element | Promise<JSX.Element>,
	) => void | Promise<void>;
	/**
	 * The DOM element where this component is mounted
	 */
	_el: HTMLElement;
	/**
	 * Create a DOM element. It is used internally by the framework.
	 */
	createDOMElement(
		tagName: string,
		options?: { [key: string]: string },
		...children: ChildenType[]
	): Node;
	/**
	 * Create a DOM Fragment element. It is used internally by the framework.
	 */
	createDOMFragment({
		children,
	}: {
		children?: ChildenType[];
	}): DocumentFragment;
}
export type SeqflowFunction<T> = (
	this: SeqflowFunctionContext,
	data: T,
) => Promise<void>;

// biome-ignore lint/suspicious/noEmptyInterface: This type is fulfilled by the user
export interface ApplicationConfiguration {}

export interface SeqflowConfiguration {
	log: LogFunction;
	config: ApplicationConfiguration;
	domains: {
		[K in keyof Domains]: (
			eventTarget: EventTarget,
			applicationDomainTargets: Readonly<{
				[D in keyof Domains]: EventTarget;
			}>,
			config: Readonly<ApplicationConfiguration>,
		) => Domains[K];
	};
	router: Router;
}

function startComponent<T extends { children?: ChildenType[]; key?: string }>(
	parentContext: SeqflowFunctionContext,
	el: HTMLElement,
	component: SeqflowFunction<T>,
	componentOption: T | undefined,
) {
	const componentName = component.name;
	parentContext.app.log.debug({
		message: "startComponent",
		data: { componentOption, componentName },
	});

	const childAbortController = new AbortController();

	// When parent is unmouted, we have to abort the child as well
	// Because the abort signal is fired only once, we have to use { once: true }
	parentContext.abortController.signal.addEventListener(
		"abort",
		() => {
			childAbortController.abort();
		},
		{ once: true },
	);
	// If this component has a key, probably it's a component that can be replaced in the future
	// The parent, when `replaceChild` is called, will dispatch an event to abort this component
	// And replace it with a new one
	if (componentOption?.key) {
		parentContext.abortController.signal.addEventListener(
			`abort-component-${componentOption.key}`,
			() => {
				childAbortController.abort();
			},
			{ once: true },
		);
	}

	// This array will contain all the children of this component
	// that has the `key` attribute. Used to replace a child.
	const componentChildren: { key: string; el: HTMLElement }[] = [];

	// When we abort the current component,
	// we have to erase the above array
	// otherwise, it is a memory leak
	childAbortController.signal.addEventListener(
		"abort",
		() => {
			while (componentChildren.pop()) {}
		},
		{ once: true },
	);

	const childContext: SeqflowFunctionContext = {
		app: parentContext.app,
		abortController: childAbortController,
		_el: el,
		waitEvents: async function* <A>(
			this: SeqflowFunctionContext,
			...fns: EventAsyncGenerator<A>[]
		): AsyncGenerator<A> {
			for await (const ev of combineEvents(childAbortController, ...fns)) {
				yield ev;
			}
		},
		replaceChild(
			this: SeqflowFunctionContext,
			key: string,
			newChild: () => JSX.Element | Promise<JSX.Element>,
		): void | Promise<void> {
			const oldChildIndex = componentChildren.findIndex((c) => c.key === key);
			if (oldChildIndex < 0) {
				this.app.log.error({
					message: "replaceChild: wrapper not found",
					data: { key, newChild },
				});
				throw new Error("replaceChild: wrapper not found");
			}

			// `this` is the parent component. WHen the user calls `replaceChild`,
			// we have to abort the child component dispatching the below event
			this.abortController.signal.dispatchEvent(
				new Event(`abort-component-${key}`),
			);

			// Remove the old child from the array, and replace it with the new one
			const [oldChild] = componentChildren.splice(oldChildIndex, 1);

			const { el: wrapper } = oldChild;

			for (const otherChild of componentChildren) {
				// If we replace a child which contains another child,
				// we have to abort the other child also
				if (oldChild.el.contains(otherChild.el)) {
					this.app.log.debug({
						message: "replaceChild: wrapper contains other child",
						data: { parent: key, child: otherChild.key },
					});
					this.abortController.signal.dispatchEvent(
						new Event(`abort-component-${otherChild.key}`),
					);
				}
			}

			const a = newChild();
			if (a instanceof Promise) {
				return a.then((child) => {
					wrapper.replaceWith(child as Node);
				});
			}

			wrapper.replaceWith(a as Node);
		},
		domEvent<K extends keyof HTMLElementEventMap>(
			this: SeqflowFunctionContext,
			eventType: K,
			options: {
				el: HTMLElement;
				preventDefault?: boolean;
			},
		): EventAsyncGenerator<HTMLElementEventMap[K]> {
			return domEvent(eventType, {
				el: options.el,
				preventDefault: options.preventDefault ?? false,
			});
		},
		domainEvent<BEE extends typeof DomainsPackage.DomainEvent<unknown>>(
			this: SeqflowFunctionContext,
			b: BEE,
		): EventAsyncGenerator<InstanceType<BEE>> {
			const domainName = b.domainName;
			const eventTarget = parentContext.app.domainEventTargets[domainName];
			return domainEvent(b.t, eventTarget);
		},
		navigationEvent(): EventAsyncGenerator<NavigationEvent> {
			this.app.log.debug({
				message: "navigationEvent",
				data: {
					componentName,
				},
			});
			const et = this.app.router.getEventTarget();
			return async function* (controller: AbortController) {
				const navigationEvents = navigationEvent(et);
				for await (const ev of combineEvents(controller, navigationEvents)) {
					yield ev;
				}
			};
		},
		createDOMFragment(
			this: SeqflowFunctionContext,
			{ children }: { children?: ChildenType[] },
		): DocumentFragment {
			this.app.log.debug({
				message: "createDOMFragment",
				data: { children },
			});
			const fragment = new DocumentFragment();
			if (!children) {
				return fragment;
			}
			if (!Array.isArray(children)) {
				children = [children];
			}
			const c = children.flat(Number.POSITIVE_INFINITY);
			for (const child of c) {
				if (typeof child === "string") {
					fragment.appendChild(document.createTextNode(child));
					continue;
				}
				if (typeof child === "number") {
					fragment.appendChild(document.createTextNode(`${child}`));
					continue;
				}
				// `Node` here means:
				// - `HTMLElement`
				// - `DocumentFragment`
				if (child instanceof Node) {
					fragment.appendChild(child);
					continue;
				}

				this.app.log.error({
					message: "Unsupported child type. Implement me",
					data: { child, children },
				});
				throw new Error("Unsupported child type");
			}

			return fragment;
		},
		createDOMElement(
			this: SeqflowFunctionContext,
			tagName: string,
			options?: { [key: string]: string },
			...children: ChildenType[]
		): Node {
			this.app.log.debug({
				message: "createDOMElement",
				data: { tagName, options, children },
			});

			if (typeof tagName === "string") {
				const el = document.createElement(tagName);
				for (const key in options) {
					if (key === "className") {
						el.setAttribute("class", options[key]);
						continue;
					}
					if (key === "htmlFor") {
						el.setAttribute("for", options[key]);
						continue;
					}
					if (key === "style") {
						const style = options[key] as string | Partial<CSSStyleDeclaration>;
						if (typeof style === "string") {
							el.setAttribute("style", style);
						} else {
							for (const styleKey in style) {
								const value = style[styleKey];
								if (value) {
									el.style[styleKey] = value;
								}
							}
						}
						continue;
					}

					// keep the key for the componentChildren array
					if (key === "key") {
						componentChildren.push({
							key: options[key],
							el,
						});
					}

					el.setAttribute(key, options[key]);
				}

				const c = children.flat(Number.POSITIVE_INFINITY);
				for (const child of c) {
					if (typeof child === "string") {
						el.appendChild(document.createTextNode(child));
						continue;
					}
					if (typeof child === "number") {
						el.appendChild(document.createTextNode(`${child}`));
						continue;
					}
					// `Node` here means:
					// - `HTMLElement`
					// - `DocumentFragment`
					if (child instanceof Node) {
						el.appendChild(child);
						continue;
					}

					this.app.log.error({
						message: "Unsupported child type. Implement me",
						data: {
							child,
							children,
							tagName,
							options,
							el,
						},
					});
					throw new Error("Unsupported child type");
				}
				return el;
			}

			if (tagName === this.createDOMFragment) {
				return this.createDOMFragment({ children });
			}

			const opt = options || {};
			if (!opt?.key) {
				opt.key = Math.random().toString();
			}

			const wrapper = document.createElement("div");
			componentChildren.push({
				key: opt.key,
				el: wrapper,
			});
			if (opt?.wrapperClass) {
				wrapper.classList.add(opt.wrapperClass);
			}

			startComponent(childContext, wrapper, tagName, {
				...opt,
				children,
			});
			return wrapper;
		},
		renderSync(this: SeqflowFunctionContext, html: string | JSX.Element) {
			if (typeof html === "string") {
				this._el.innerHTML = html;
				return;
			}
			this._el.innerHTML = "";
			this._el.appendChild(html as Node);
		},
	};

	const v = component.call(childContext, componentOption || ({} as T));
	if (v.then !== undefined) {
		v.then(
			() => {
				parentContext.app.log.debug({
					message: "Component rendering ended",
					data: {
						componentOption,
						componentName,
					},
				});
			},
			(e) => {
				parentContext.app.log.error({
					message: "Component throws an error",
					data: {
						componentOption,
						componentName,
						errorMessage: e.message,
						error: e,
						stack: e.stack,
					},
				});
			},
		);
	}
}

export function start<
	Component extends SeqflowFunction<FirstComponentData>,
	// biome-ignore lint/suspicious/noExplicitAny: We don't care about the component properties
	FirstComponentData extends Record<string, any> & {
		children?: ChildenType[];
	},
>(
	root: HTMLElement,
	firstComponent: Component,
	componentOption: FirstComponentData | undefined,
	seqflowConfiguration: Partial<
		Omit<SeqflowConfiguration, "log"> & { log?: Partial<LogFunction> }
	>,
): AbortController {
	const seqflowConfig = applyDefaults(seqflowConfiguration);

	const { domains, domainEventTargets } = createDomains(
		seqflowConfig.domains,
		seqflowConfig.config,
	);

	seqflowConfig.router.install();
	const appContext: SeqflowAppContext = {
		log: seqflowConfig.log,
		domains,
		domainEventTargets,
		config: seqflowConfig.config,
		router: seqflowConfig.router,
	};
	seqflowConfig.router.getEventTarget().addEventListener("navigation", (ev) => {
		appContext.log.info({
			message: "navigate",
			data: {
				path: (ev as NavigationEvent).path,
				event: ev,
			},
		});
	});

	const mainAbortController = new AbortController();
	const mainContext: SeqflowFunctionContext = {
		app: appContext,
		abortController: mainAbortController,
		_el: root,
		// biome-ignore lint/correctness/useYield: This is a generator function
		waitEvents: async function* <A>(): AsyncGenerator<A> {
			throw new Error("waitEvents is not supported in the main context");
		},
		replaceChild: () => {
			throw new Error("replaceChild is not supported in the main context");
		},
		domEvent: <K extends keyof HTMLElementEventMap>(): EventAsyncGenerator<
			HTMLElementEventMap[K]
		> => {
			throw new Error("domEvent is not supported in the main context");
		},
		domainEvent<
			BEE extends typeof DomainsPackage.DomainEvent<unknown>,
		>(): EventAsyncGenerator<InstanceType<BEE>> {
			throw new Error("domainEvent is not supported in the main context");
		},
		navigationEvent(): EventAsyncGenerator<NavigationEvent> {
			throw new Error("routerEvent is not supported in the main context");
		},
		createDOMFragment(): DocumentFragment {
			throw new Error("createDOMFragment is not supported in the main context");
		},
		createDOMElement(
			tagName: string,
			options?: { [key: string]: string },
			...children: ChildenType[]
		): Node {
			const el = document.createElement(tagName);
			for (const key in options) {
				el.setAttribute(key, options[key]);
			}
			for (const child of children) {
				if (typeof child === "string") {
					el.appendChild(document.createTextNode(child));
					continue;
				}
				throw new Error("Unsupported child type");
			}
			return el;
		},
		renderSync(html: string | JSX.Element) {
			if (typeof html === "string") {
				this._el.innerHTML = html;
				return;
			}
			this._el.innerHTML = "";
			this._el.appendChild(html as Node);
		},
	};

	startComponent(mainContext, root, firstComponent, componentOption);

	return mainAbortController;
}

function applyDefaults(
	seqflowConfiguration: Partial<
		Omit<SeqflowConfiguration, "log"> & { log?: Partial<LogFunction> }
	>,
): SeqflowConfiguration {
	function noop() {}

	if (seqflowConfiguration.router === undefined) {
		seqflowConfiguration.router = new BrowserRouter(new EventTarget());
	}

	if (seqflowConfiguration.log === undefined) {
		seqflowConfiguration.log = {};
	}
	if (seqflowConfiguration.log.info === undefined) {
		seqflowConfiguration.log.info = noop;
	}
	if (seqflowConfiguration.log.error === undefined) {
		seqflowConfiguration.log.error = noop;
	}
	if (seqflowConfiguration.log.debug === undefined) {
		seqflowConfiguration.log.debug = noop;
	}

	return Object.assign(
		{},
		{
			config: {},
			domains: {},
		},
		seqflowConfiguration,
	) as SeqflowConfiguration;
}

function createDomains(
	domainFunctions: SeqflowConfiguration["domains"],
	applicationConfiguration: ApplicationConfiguration,
): {
	domains: Domains;
	domainEventTargets: { [K in keyof Domains]: EventTarget };
} {
	const domainEventTargetsPartial: Record<string, EventTarget> = {};

	const domainKeys = Object.keys(domainFunctions);
	for (const domainKey of domainKeys) {
		domainEventTargetsPartial[domainKey] = new EventTarget();
	}

	const domainEventTargets = domainEventTargetsPartial as {
		[K in keyof Domains]: EventTarget;
	};
	const domains: Record<string, unknown> = {};
	for (const domainKey of domainKeys as (keyof Domains)[]) {
		// biome-ignore lint/complexity/noBannedTypes: Don't care about `Function` banned type
		const c = domainFunctions[domainKey as keyof Domains] as Function;
		domains[domainKey] = c(
			domainEventTargets[domainKey],
			domainEventTargets,
			applicationConfiguration,
		);
	}

	return {
		domains: domains as unknown as Domains,
		domainEventTargets: domainEventTargets as {
			[K in keyof Domains]: EventTarget;
		},
	};
}

type ChildenType = Element | Element[];

declare global {
	namespace JSX {
		// The return type of <button />
		type Element = HTMLElement;

		export type ARG<T = object> = T & {
			children?: ChildenType;
		};

		// This is the type of the first parameter of the jsxFactory
		type ElementType<T> =
			| string
			| ((
					this: SeqflowFunctionContext,
					// biome-ignore lint/suspicious/noExplicitAny: We don't care about the component properties
					data?: Record<string, any>,
			  ) => Promise<void>);

		type Foo = {
			[K in keyof HTMLElementTagNameMap]: Omit<
				Partial<{
					[V in keyof HTMLElementTagNameMap[K]]: HTMLElementTagNameMap[K][V];
				}>,
				"style"
			> &
				ARG<{
					style?: Partial<CSSStyleDeclaration> | string;
					key?: string;
				}>;
		};
		interface IntrinsicElements extends Foo {}

		interface IntrinsicAttributes {
			key?: string;
			wrapperClass?: string;
		}
	}
}
