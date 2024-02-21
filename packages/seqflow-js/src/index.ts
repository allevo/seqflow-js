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

export interface ComponentParam<T = unknown> {
	data: T;
	domains: Domains;
	signal: AbortSignal;
	_controller: AbortController;
	dom: {
		render(html: string): void;
		querySelector<E = HTMLElement>(selector: string): E;
		child(id: string, fn: ComponentFn<unknown>);
		child<E>(id: string, fn: ComponentFn<E>, option: ChildOption<E>);
	};
	event: {
		dispatchDomainEvent<D, BE extends DomainEvent<D> = DomainEvent<D>>(
			event: BE,
		);
		dispatchEvent(event: Event): void;
		domEvent<K extends keyof HTMLElementEventMap>(
			type: K,
			filter?: (el: HTMLElementEventMap[K]) => boolean,
		): (controller: AbortController) => AsyncGenerator<Event>;
		domainEvent<BEE extends typeof DomainEvent<unknown>>(
			b: BEE,
		): (b: AbortController) => AsyncGenerator<InstanceType<BEE>>;
		navigationEvent(): (controller: AbortController) => AsyncGenerator<Event>;
		navigate(path: string);
		waitEvent<T extends Event[]>(
			...fns: {
				[I in keyof T]: (controller: AbortController) => AsyncGenerator<T[I]>;
			}
		): AsyncGenerator<T[number]>;
	};
}
interface ComponentFn<T = unknown> {
	(param: ComponentParam<T>): Promise<void>;
}

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
						stopPropagation: true,
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
				filter?: (el: HTMLElementEventMap[K]) => boolean,
			) {
				configuration.log({
					msg: `Waiting for DOM event ${type}`,
					data: {
						name: fn.name,
						isFirstRender,
					},
				});

				return iterOnEvents<HTMLElementEventMap[K]>(el, type, {
					preventDefault: true,
					stopPropagation: true,
					stopImmediatePropagation: false,
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

type Log = {
	msg: string;
	data: unknown;
};
type StartParameters = {
	log: (log: Log) => void;
	domains: { [K in keyof Domains]: DomainCreator<Domains[K]> };
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

function startSeqFlow<T>(el: HTMLElement, fn: ComponentFn<T>): AbortController;
function startSeqFlow<T>(
	el: HTMLElement,
	fn: ComponentFn<T>,
	config: Partial<StartParameters>,
): AbortController;
function startSeqFlow<T>(
	el: HTMLElement,
	fn: ComponentFn<T>,
	option?: ChildOption<T>,
	config?: Partial<StartParameters>,
): AbortController;

function startSeqFlow<T>(...args: unknown[]) {
	let el: HTMLElement;
	let fn: ComponentFn<T>;
	let config: Partial<StartParameters> | undefined;
	let option: ChildOption<T>;

	if (args.length === 2) {
		el = args[0] as HTMLElement;
		fn = args[1] as ComponentFn<T>;
		option = {} as ChildOption<T>;
	} else if (args.length === 3) {
		el = args[0] as HTMLElement;
		fn = args[1] as ComponentFn<T>;
		config = args[2] as Partial<StartParameters>;
		option = {} as ChildOption<T>;
	} else if (args.length === 4) {
		el = args[0] as HTMLElement;
		fn = args[1] as ComponentFn<T>;
		option = args[2] as ChildOption<T>;
		config = args[3] as Partial<StartParameters>;
	} else {
		throw new Error("Invalid parameters count");
	}

	const params = applyDefault(config);
	const configuration = createConfiguration(params);
	const a = Component(el, fn, option, configuration);

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

export const start = startSeqFlow;

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
