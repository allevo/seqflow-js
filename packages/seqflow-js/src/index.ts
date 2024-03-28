import { iterOnEvents } from "./event-utils";

export type ChildOption<T = unknown> = {
	data: T;
};

type AbortControllerWithId = AbortController & { id: number };

let _abortControllerId = 0;
function generateAbortController() {
	const controller = new AbortController();
	(controller as AbortControllerWithId).id = _abortControllerId++;

	return controller;
}

export class DomainEvent<T> extends Event implements CustomEvent<T> {
	static domainName: keyof Domains;
	static t: string;
	detail: T;

	constructor(detail: T, eventType = "") {
		super(eventType, { bubbles: true });
		this.detail = detail;
	}

	/* v8 ignore next 3 */
	initCustomEvent(): void {
		throw new Error("Method not implemented.");
	}
}
export type GetDataType<T> = T extends DomainEvent<infer R> ? R : never;
export type GetArrayOf<T> = () => T[];

export function createDomainEventClass<T>(
	domainName: keyof Domains,
	type: string,
) {
	class CustomBusinessEvent extends DomainEvent<T> {
		static readonly domainName = domainName;
		static readonly t = type;

		constructor(detail: T) {
			super(detail, type);
		}
	}
	return CustomBusinessEvent;
}

export interface DomEventOption {
	element: HTMLElement;
	preventDefault: boolean;
	stopPropagation: boolean;
	stopImmediatePropagation: boolean;
}
export type AbortableAsyncGenerator<T> = (
	controller: AbortController,
) => AsyncGenerator<T>;

export interface ComponentParam<T = unknown> {
	data: T;
	domains: Domains;
	signal: AbortSignal;
	_controller: AbortController;
	router: {
		/**
		 * Navigate to a new path
		 *
		 * @param path new path
		 */
		navigate(path: string);
		/**
		 * Current path segments
		 */
		segments: string[];
		/**
		 * Current query parameters
		 */
		query: Map<string, string>;
	};
	dom: {
		/**
		 * Render HTML to the component
		 *
		 * @param html innerHTML to render
		 */
		render(html: string): void;
		/**
		 * Query a single element inside the current component
		 *
		 * @param selector query selector
		 */
		querySelector<E = HTMLElement>(selector: string): E;
		/**
		 * Query all elements inside the current component
		 *
		 * @param selector query selector
		 */
		querySelectorAll<E extends Node = Node>(selector): NodeListOf<E>;
		/**
		 * Mount a child component
		 *
		 * @param id mount point element id
		 * @param fn child component function
		 * @param option child component option
		 */
		child(id: string, fn: ComponentFn<unknown>): void;
		child<E>(id: string, fn: ComponentFn<E>, option: ChildOption<E>): void;
	};
	event: {
		/**
		 * Dispatch a domain event
		 *
		 * @param event domain event
		 */
		dispatchDomainEvent<D, BE extends DomainEvent<D> = DomainEvent<D>>(
			event: BE,
		);
		dispatchEvent(event: Event): void;
		/**
		 * Async generator for DOM event.
		 *
		 * @param type event type
		 */
		domEvent<K extends keyof HTMLElementEventMap>(
			type: K,
			option?: Partial<DomEventOption>,
		): AbortableAsyncGenerator<Event>;
		domainEvent<BEE extends typeof DomainEvent<unknown>>(
			b: BEE,
		): AbortableAsyncGenerator<InstanceType<BEE>>;
		/**
		 * Async generator for navigation event
		 */
		navigationEvent(): AbortableAsyncGenerator<Event>;
		/**
		 * Combine multiple event generators into one
		 *
		 * @param fns event generators
		 */
		waitEvent<T extends Event[]>(
			...fns: {
				[I in keyof T]: AbortableAsyncGenerator<T[I]>;
			}
		): AsyncGenerator<T[number]>;
	};
}

/**
 * Component function
 *
 * @typeParam T - The type of the data passed to the component
 *
 * @param param The component parameter
 *
 * @returns A promise without a value
 */
export type ComponentFn<T = unknown> = (
	param: ComponentParam<T>,
) => Promise<void>;

function Component<T = unknown>(
	el: HTMLElement,
	fn: (p: ComponentParam<T>) => Promise<void>,
	option: ChildOption<T>,
	configuration: GlobalConfiguration,
) {
	let controller = generateAbortController();
	const children = {} as Record<string, ReturnType<typeof Component>>;

	controller.signal.addEventListener("abort", () => {
		for (const mountPoint in children) {
			configuration.log({
				msg: "Aborting child component",
				data: {
					parent: fn.name,
					child: mountPoint,
				},
			});
			children[mountPoint]._controller.abort("Parent controller aborted");
		}
	});

	configuration.log({
		msg: "Component Mounted",
		data: {
			name: fn.name,
			id: (controller as AbortControllerWithId).id,
		},
	});

	let isFirstRender = true;
	const b: Omit<ComponentParam<T>, "data"> = {
		domains: configuration.domains,
		router: {
			navigate(path: string) {
				configuration.log({
					msg: "Navigating",
					data: {
						name: fn.name,
						path,
					},
				});
				let navigationPath = path;
				if (navigationPath.startsWith("http")) {
					const url = new URL(path);
					navigationPath = url.pathname + url.search;
				}

				configuration.navigationEventBus.dispatchEvent(
					new NavigationEvent(navigationPath),
				);
				window.history.pushState({}, "", navigationPath);
			},
			get segments() {
				const segments = window.location.pathname.split("/");
				// first element is always empty
				segments.shift();
				return segments;
			},
			get query() {
				const url = new URL(window.location.href);
				return new Map<string, string>(url.searchParams);
			},
		},
		dom: {
			render(html: string) {
				configuration.log({
					msg: "Rendering component",
					data: {
						name: fn.name,
						isFirstRender,
					},
				});

				if (!isFirstRender) {
					controller.abort("Rerendering the component");

					for (const mountPoint in children) {
						configuration.log({
							msg: "Aborting child component",
							data: {
								parent: fn.name,
								child: mountPoint,
								isFirstRender,
							},
						});
						children[mountPoint]._controller.abort("Rerendering the component");
					}

					isFirstRender = false;

					controller = generateAbortController();
				}

				el.innerHTML = html;

				configuration.log({
					msg: "Component rendered",
					data: {
						name: fn.name,
					},
				});
			},
			querySelector<T = HTMLElement>(selector): T {
				return el.querySelector(selector);
			},
			querySelectorAll<T extends Node = Node>(selector): NodeListOf<T> {
				return el.querySelectorAll(selector);
			},
			child(...args: unknown[]) {
				let id: string;
				let childFn: ComponentFn<T>;
				let option: ChildOption<T>;
				if (args.length === 2) {
					id = args[0] as string;
					childFn = args[1] as ComponentFn<T>;
					option = {} as ChildOption<T>;
				} else if (args.length === 3) {
					id = args[0] as string;
					childFn = args[1] as ComponentFn<T>;
					option = args[2] as ChildOption<T>;
				} else {
					throw new Error("Invalid number of arguments");
				}

				configuration.log({
					msg: "Mounting child component",
					data: {
						parent: fn.name,
						mountPoint: id,
						child: childFn.name,
					},
				});

				const el2 = el.querySelector(`#${id}`);
				if (!el2) {
					throw new Error(`Mount point not found: ${id}`);
				}

				if (children[id]) {
					children[id]._controller.abort("Parent controller aborted");
				}

				children[id] = Component(
					el2 as HTMLElement,
					childFn,
					option,
					configuration,
				);
			},
		},
		event: {
			navigationEvent() {
				return iterOnEvents<NavigationEvent>(
					configuration.navigationEventBus,
					"navigate",
					{
						preventDefault: true,
						stopPropagation: false,
						stopImmediatePropagation: false,
					},
				);
			},

			domainEvent<BEE extends typeof DomainEvent<unknown>>(
				b: BEE,
			): (b: AbortController) => AsyncGenerator<InstanceType<BEE>> {
				const domainKey = b.domainName;
				const type = b.t;

				configuration.log({
					msg: "Waiting for Business event",
					data: {
						name: fn.name,
						isFirstRender,
						domainKey,
						type,
					},
				});

				return iterOnEvents<InstanceType<BEE>>(
					configuration.domainEventBuses[domainKey],
					type,
					{
						preventDefault: false,
						stopPropagation: false,
						stopImmediatePropagation: false,
					},
				);
			},
			domEvent<K extends keyof HTMLElementEventMap>(
				type: K,
				option?: Partial<{
					element: HTMLElement;
					preventDefault: boolean;
					stopPropagation: boolean;
					stopImmediatePropagation: boolean;
				}>,
			) {
				configuration.log({
					msg: `Waiting for DOM event ${type}`,
					data: {
						name: fn.name,
						isFirstRender,
					},
				});

				const element = option?.element || el;

				return iterOnEvents<HTMLElementEventMap[K]>(element, type, {
					preventDefault: option?.preventDefault || false,
					stopPropagation: option?.stopPropagation || false,
					stopImmediatePropagation: option?.stopImmediatePropagation || false,
				});
			},
			waitEvent<T extends Event[]>(
				...fns: {
					[I in keyof T]: (controller: AbortController) => AsyncGenerator<T[I]>;
				}
			): AsyncGenerator<T[number]> {
				configuration.log({
					msg: "Waiting for event",
					data: {
						name: fn.name,
						isFirstRender,
					},
				});

				const _controller = generateAbortController();

				controller.signal.addEventListener(
					"abort",
					() => {
						_controller.abort("Parent controller aborted");
					},
					{
						once: true,
					},
				);

				if (fns.length === 0) {
					throw new Error("waitEvent needs at least one argument");
				}

				if (fns.length === 1) {
					return fns[0](_controller);
				}

				const queue: Event[] = [];

				const controllers = [] as AbortController[];

				Promise.all(
					fns.map((fn) => {
						const c = generateAbortController();
						controllers.push(c);
						const it = fn(c);
						return (async () => {
							let result = await it.next();
							while (!result.done) {
								queue.push(result.value);
								_controller.signal.dispatchEvent(new Event("wakeup"));
								result = await it.next();
							}
						})();
					}),
				).catch((e) => {
					console.error("ERROR", e);
				});

				return (async function* () {
					while (true) {
						_controller.signal.throwIfAborted();

						if (queue.length > 0) {
							yield queue.shift() as T[number];
						} else {
							await new Promise<void>((resolve) => {
								_controller.signal.addEventListener("wakeup", () => resolve(), {
									once: true,
									signal: _controller.signal,
								});
							});
						}
					}
				})();
			},
			dispatchEvent(event: Event) {
				configuration.log({
					msg: "Dispatching event",
					data: {
						name: fn.name,
						eventType: event.type,
					},
				});
				el.dispatchEvent(event);
			},
			dispatchDomainEvent<D, BE extends DomainEvent<D> = DomainEvent<D>>(
				event: BE,
			) {
				const domainName = (event.constructor as typeof DomainEvent<D>)
					.domainName;
				configuration.log({
					msg: "Dispatching business event",
					data: {
						name: fn.name,
						domainName,
						eventType: event.type,
					},
				});
				(
					configuration.domainEventBuses[domainName] as EventTarget
				).dispatchEvent(event);
			},
		},
		_controller: controller,
		signal: controller.signal,
	};

	if (option?.data) {
		(b as ComponentParam<unknown>).data = option.data;
	}

	fn(b as ComponentParam<T>).then(
		() => {
			configuration.log({
				msg: "ENDED!",
				data: {
					name: fn.name,
					id: (controller as AbortControllerWithId).id,
				},
			});
		},
		(e) => {
			/* v8 ignore next 9 */
			configuration.log({
				msg: "ENDED WITH ERROR!",
				data: {
					name: fn.name,
					id: (controller as AbortControllerWithId).id,
					error: e,
				},
			});
		},
	);

	return b as ComponentParam<T>;
}

interface DomainCreator<Domain> {
	(
		domainEventBus: EventTarget,
		allDomainEventBus: Record<string, EventTarget>,
		config: ApplicationConfig,
	): Domain;
}

type DomainCreators = { [K in keyof Domains]: DomainCreator<Domains[K]> };

export type Log = {
	msg: string;
	data: unknown;
};
export type StartParameters = {
	log: (log: Log) => void;
	domains: DomainCreators;
	navigationEventBus: EventTarget;
	config: ApplicationConfig;
};
interface GlobalConfiguration {
	log: (log: Log) => void;
	domains: Domains;
	domainEventBuses: { [K in keyof Domains]: EventTarget };
	navigationEventBus: EventTarget;
	config: ApplicationConfig;
}

/**
 * Start a new SeqFlow application
 *
 * @typeParam T - The type of the data passed to the component
 *
 * @param el The element to mount the component
 * @param fn The component function
 * @param option The component option
 * @param config The application configuration
 * @return The controller to abort the component
 */
export function start<T>(
	el: HTMLElement,
	fn: ComponentFn<T>,
	option?: ChildOption<T>,
	config?: Partial<StartParameters>,
): AbortController {
	const option2 = (option || {}) as ChildOption<T>;

	const params = applyDefault(config);
	const configuration = createConfiguration(params);
	const a = Component(el, fn, option2, configuration);

	a._controller.signal.addEventListener("abort", () => {
		configuration.log({
			msg: "Component aborted",
			data: {
				name: fn.name,
			},
		});
	});

	return a._controller;
}

function createConfiguration(params: StartParameters): GlobalConfiguration {
	const domainEventBuses = {};
	for (const domainName in params.domains) {
		domainEventBuses[domainName] = new EventTarget();
	}

	const domains = {};
	for (const domainName in params.domains) {
		domains[domainName] = params.domains[domainName](
			domainEventBuses[domainName],
			domainEventBuses,
			params.config,
		);
	}

	const config: GlobalConfiguration = {
		log: params.log,
		navigationEventBus: params.navigationEventBus,
		domains: domains as Domains,
		domainEventBuses:
			domainEventBuses as GlobalConfiguration["domainEventBuses"],
		config: params.config,
	};
	return config;
}

function noop() {}
function applyDefault(config?: Partial<StartParameters>) {
	const c: Partial<StartParameters> = config || {};
	if (!c.log) {
		c.log = noop;
	}
	if (!c.domains) {
		c.domains = {} as StartParameters["domains"];
	}
	if (!c.navigationEventBus) {
		c.navigationEventBus = new EventTarget();
	}
	if (!c.config) {
		c.config = {} as StartParameters["config"];
	}

	return c as StartParameters;
}

// biome-ignore lint/suspicious/noEmptyInterface: This type is fulfilled by the user
export interface Domains {}
// biome-ignore lint/suspicious/noEmptyInterface: This type is fulfilled by the user
export interface ApplicationConfig {}

export class NavigationEvent extends Event {
	constructor(public readonly path: string) {
		super("navigate", { bubbles: false });
	}
}
