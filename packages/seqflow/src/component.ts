import type {
	Contexts,
	Domains,
	ElementProperty,
	SeqFlowAppContext,
	SeqFlowComponent,
} from ".";
import type { DomainEvent } from "./domains";
import {
	type EventAsyncGenerator,
	combineEventAsyncGenerators,
	domEvent,
	domainEvent,
	navigationEvent,
} from "./events";
import type { NavigationEvent } from "./router";

class ReplaceChildComponentEvent extends Event {
	constructor(public key: string) {
		super(`replace-component-${key}`);
	}
}

function applyProps<X extends HTMLElement | SVGElement | MathMLElement>(
	element: X,
	props: Record<Exclude<string, "className" | "style" | "htmlFor">, unknown> & {
		className?: ElementProperty<HTMLElement>["className"];
		style?: ElementProperty<HTMLElement>["style"];
		htmlFor?: ElementProperty<HTMLLabelElement>["htmlFor"];
	},
): X {
	const keys = Object.keys(props);
	const keysLength = keys.length;
	for (let i = 0; i < keysLength; i++) {
		const key = keys[i];
		const value = props[key];

		if (value === undefined || value === null) {
			continue;
		}

		if (key === "className") {
			continue;
		}
		if (key === "style") {
			continue;
		}
		if (key === "key") {
			continue;
		}

		if (key === "htmlFor") {
			const h: NonNullable<ElementProperty<HTMLLabelElement>["htmlFor"]> =
				value as NonNullable<(typeof props)["htmlFor"]>;
			(element as HTMLLabelElement).htmlFor = h;
		} else {
			switch (typeof value) {
				case "boolean":
					if (value) {
						element.setAttribute(key, "");
					} else {
						element.removeAttribute(key);
					}
					break;
				case "number":
					element.setAttribute(key, value.toString());
					break;
				case "string":
					element.setAttribute(key, value);
					break;
			}
		}
	}

	return element;
}

function addChildren(
	el: HTMLElement | SVGAElement | MathMLElement | DocumentFragment,
	children: (string | number | null | undefined | JSX.Element)[],
	appContext: SeqFlowAppContext<Domains>,
) {
	// @ts-ignore
	const c = children.flat(Number.POSITIVE_INFINITY);
	for (let i = 0; i < c.length; i++) {
		const child = c[i];
		switch (typeof child) {
			case "undefined":
				break;
			case "number":
			case "string":
				el.appendChild(document.createTextNode(child.toString()));
				break;
			default:
				if (child !== null) {
					if (!(child instanceof Node)) {
						// TODO: log error better than this
						appContext.log.error(child);
						break;
					}
					el.appendChild(child);
				}
				break;
		}
	}
}

type GetYieldType<A extends EventAsyncGenerator<unknown>> = Exclude<
	Awaited<ReturnType<ReturnType<A>["next"]>>,
	IteratorReturnResult<unknown>
>["value"];

export type DomEventOption = {
	preventDefault?: boolean;
	stopPropagation?: boolean;
	stopImmediatePropagation?: boolean;
	fn?: (ev: Event) => boolean | undefined;
};

const DEFAULT_TAG_NAME = () => "div";

export type KeyPair = {
	local: string;
	global: string;
};

export class SeqFlowComponentContext {
	// children: components or elements with onClick
	private c: {
		keyPair: KeyPair;
		el: Element;
		mounted: boolean;
	}[] = [];

	constructor(
		// mount point
		public _el: HTMLElement | SVGElement | MathMLElement,
		// abort controller
		public ac: AbortController,
		private app: SeqFlowAppContext<Domains>,
		private keyPair: KeyPair,
	) {}

	// @ts-ignore
	createDOMFragment: symbol;

	createDOMElement(
		tagNameOrComponentFunction: JSX.ElementType,
		p: null | Record<string, unknown>,
		...children: (string | number | null | undefined | JSX.Element)[]
	): JSX.Element {
		const props = p || {};
		let el: HTMLElement | SVGElement | MathMLElement | DocumentFragment;
		if (typeof tagNameOrComponentFunction === "string") {
			if (tagNameOrComponentFunction.includes(":")) {
				const [namespace, tagName] = tagNameOrComponentFunction.split(":");
				switch (namespace) {
					case "svg":
						el = applyProps(
							document.createElementNS("http://www.w3.org/2000/svg", tagName),
							props,
						);
						break;
					case "math":
						el = applyProps(
							document.createElementNS(
								"http://www.w3.org/1998/Math/MathML",
								tagName,
							),
							props,
						);
						break;
					default:
						throw new Error(`Unknown namespace: ${namespace}`);
				}
			} else {
				el = applyProps(
					document.createElement(tagNameOrComponentFunction),
					props,
				);
			}
		} else if (typeof tagNameOrComponentFunction === "symbol") {
			// It is a fragment
			if (tagNameOrComponentFunction === this.createDOMFragment) {
				el = document.createDocumentFragment();
			} else {
				throw new Error(
					"Unrecognize symbol: expected only createDOMFragment symbol",
				);
			}
		} else if (tagNameOrComponentFunction instanceof Function) {
			props.key =
				props && "key" in props
					? (props.key as string)
					: this.app.idGenerator();

			// Create wrapper element
			const tagName =
				(tagNameOrComponentFunction as SeqFlowComponent<object>).tagName ??
				DEFAULT_TAG_NAME;
			el = document.createElement(tagName(props));
			const childAbortController = new AbortController();
			const childComponentContext = new SeqFlowComponentContext(
				el,
				childAbortController,
				this.app,
				{
					local: props.key as string,
					global: this.app.idGenerator(),
				},
			);

			// Store the global key on the dom element
			// so we can identify it later
			el.dataset.globalKey = childComponentContext.keyPair.global;

			// Set data-* attributes to element
			for (const key in props) {
				if (!key.startsWith("data-")) {
					continue;
				}
				el.setAttribute(key, props[key] as string);
			}

			// If the parent component (here `this` is the parent) is aborted
			// we have to abort the child component
			const onAbort = () => {
				childAbortController.abort();
				this.ac.signal.removeEventListener("abort", onAbort);
				this.ac.signal.removeEventListener(
					`replace-component-${props.key}`,
					onReplaceChild,
				);
			};
			this.ac.signal.addEventListener("abort", onAbort);

			// When the parent component (here `this` is the parent) want to replace a child
			// we have to abort the child component
			const onReplaceChild = () => {
				childAbortController.abort();
				this.ac.signal.removeEventListener(
					`replace-component-${props.key}`,
					onReplaceChild,
				);
			};
			this.ac.signal.addEventListener(
				`replace-component-${props.key}`,
				onReplaceChild,
			);

			const componentName = tagNameOrComponentFunction.name;

			const contexts: Contexts = {
				component: childComponentContext,
				app: this.app,
			};

			this.app.pluginManager.onComponentCreated(
				contexts,
				contexts.component.keyPair,
				props,
			);

			let output: void | Promise<void> = undefined;
			try {
				output = tagNameOrComponentFunction(
					{
						...props,
						children,
					},
					contexts,
				);
			} catch (e) {
				const err = e as Error;
				this.app.pluginManager.onComponentEnded(
					contexts,
					contexts.component.keyPair,
					props,
					{
						status: "error",
						error: err,
					},
				);
				this.app.log.error({
					message: "Component throws an error",
					data: {
						componentOption: props,
						componentName,
						errorMessage: err.message,
						error: err,
						stack: err.stack,
					},
				});
			}
			if (output instanceof Promise) {
				output.then(
					() => {
						this.app.pluginManager.onComponentEnded(
							contexts,
							contexts.component.keyPair,
							props,
							{
								status: "success",
							},
						);
						this.app.log.debug({
							message: "Component rendering ended",
							data: {
								componentOption: props,
								componentName: componentName,
							},
						});
					},
					(e) => {
						// If the component is aborted, we don't have to log the error
						// and we treat it as a success
						if (childAbortController.signal.aborted) {
							this.app.pluginManager.onComponentEnded(
								contexts,
								contexts.component.keyPair,
								props,
								{
									status: "success",
								},
							);
							this.app.log.debug({
								message: "Component rendering ended",
								data: {
									componentOption: props,
									componentName: componentName,
								},
							});
						} else {
							this.app.pluginManager.onComponentEnded(
								contexts,
								contexts.component.keyPair,
								props,
								{
									status: "error",
									error: e,
								},
							);
							this.app.log.error({
								message: "Component throws an error",
								data: {
									componentOption: props,
									componentName,
									errorMessage: e.message,
									error: e,
									stack: e.stack,
								},
							});
						}
					},
				);
			} else {
				this.app.pluginManager.onComponentEnded(
					contexts,
					contexts.component.keyPair,
					props,
					{
						status: "success",
					},
				);
				this.app.log.debug({
					message: "Component rendering ended",
					data: {
						componentOption: props,
						componentName: componentName,
					},
				});
			}
		} else {
			throw new Error("Unknown type");
		}

		// If the component has a key, we have to keep track of it to use `getChild` and `findChild` methods later
		if (props && "key" in props && !(el instanceof DocumentFragment)) {
			const key = props.key as string;

			let globalKey = el.dataset.globalKey;
			if (!globalKey) {
				globalKey = this.app.idGenerator();
				el.dataset.globalKey = globalKey;
			}

			this.c.push({
				keyPair: {
					local: key,
					global: globalKey,
				},
				el,
				mounted: false,
			});
		}

		// Automatic onClick event listener
		if (props && "onClick" in props && el instanceof HTMLElement) {
			const onClick = props.onClick as Required<
				ElementProperty<HTMLElement>
			>["onClick"];
			const localKey =
				"key" in props ? (props.key as string) : this.app.idGenerator();
			const globalKey = this.app.idGenerator();
			const elAbortController = new AbortController();
			const onAbort = () => {
				elAbortController.abort();
				this.ac.signal.removeEventListener("abort", onAbort);
				this.ac.signal.removeEventListener(
					`replace-component-${localKey}`,
					onReplaceChild,
				);
			};
			this.ac.signal.addEventListener("abort", onAbort);
			const onReplaceChild = () => {
				elAbortController.abort();
				this.ac.signal.removeEventListener(
					`replace-component-${localKey}`,
					onReplaceChild,
				);
			};
			this.ac.signal.addEventListener(
				`replace-component-${localKey}`,
				onReplaceChild,
			);
			this.c.push({
				keyPair: {
					local: localKey,
					global: globalKey,
				},
				el,
				mounted: false,
			});
			el.addEventListener("click", onClick, {
				signal: elAbortController.signal,
			});
		}

		// Set the id, style, className
		if (props && "id" in props && el instanceof Element) {
			el.id = props.id as string;
		}
		if (props && "style" in props && el instanceof HTMLElement) {
			const style = props.style as string | Partial<CSSStyleDeclaration>;
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
		}
		if (props && "className" in props && el instanceof HTMLElement) {
			const v = props.className as JSX.IntrinsicAttributes["className"];
			if (v) {
				const classes = Array.isArray(v) ? v : [...v.split(" ")];
				el.classList.add(...classes.filter(Boolean));
			}
		}

		// Add children only if the element is not a Component function
		// In fact, we expect a Component function to add children itself using `children` prop
		if (typeof tagNameOrComponentFunction !== "function") {
			addChildren(el, children, this.app);
		}

		return el;
	}

	renderSync(
		element: string | number | null | undefined | JSX.Element | JSX.Element[],
	) {
		// Remove all the content previoursly rendered
		this._el.innerHTML = "";

		// If the developer invokes `renderSync` multiple times
		// we need to unmount all the children
		// `this.c` contains all the children, the old and the new ones
		// In fact `createDOMElement` creates children and only after this method is called.
		// Then means that `this.c` contains the old children and the new ones
		// During the creation, we add it with `mounted` set to false
		// Here we set it to true at the end of the method
		// So at this point, we have:
		// - the old children with `mounted` set to true
		// - the new children with `mounted` set to false
		// The following code removes all the children with `mounted` set to true
		// and dispatches an event to abort the children.
		// We want to keep only the new children, which are not yet mounted at this point
		this.c = this.c.filter((c) => {
			if (c.mounted) {
				this.ac.signal.dispatchEvent(
					new ReplaceChildComponentEvent(c.keyPair.local),
				);
			}
			return !c.mounted;
		});

		// This means we want to remove all children
		// keep the only the wrapper
		if (element === null || element === undefined) {
			return;
		}
		switch (typeof element) {
			case "string":
			case "number":
				this._el.appendChild(document.createTextNode(element.toString()));
				break;
			case "object":
				if (Array.isArray(element)) {
					for (const e of element.flat(Number.POSITIVE_INFINITY)) {
						if (typeof e === "string" || typeof e === "number") {
							this._el.appendChild(document.createTextNode(`${e}`));
							continue;
						}
						this._el.appendChild(e);
					}
					break;
				}
				if (element instanceof Node) {
					this._el.appendChild(element);
					break;
				}
				// TODO: we should throw an error or ignore it?
				this.app.log.error({
					message: "renderSync: invalid element",
					data: { element },
				});
				break;
			default:
				// TODO: we should throw an error or ignore it?
				this.app.log.error({
					message: "renderSync: invalid element",
					data: { element },
				});
				break;
		}

		// Set the mounted flag to true for all the remain children
		for (const child of this.c) {
			child.mounted = true;
		}
	}

	getChild<E extends HTMLElement = HTMLElement>(key: string): E {
		const child = this.findChild<E>(key);
		if (!child) {
			this.app.log.error({
				message: "getChild: wrapper not found",
				data: { key },
			});
			throw new Error("getChild: wrapper not found");
		}
		return child;
	}

	findChild<E extends HTMLElement = HTMLElement>(key: string): E | null {
		const child = this.c.find((c) => c.keyPair.local === key);
		if (child) {
			return child.el as E;
		}
		return null;
	}

	replaceChild(
		key: string,
		newChild: () => JSX.Element | Promise<JSX.Element>,
	): void | Promise<void> {
		const oldChildIndex = this.c.findIndex((c) => c.keyPair.local === key);
		if (oldChildIndex < 0) {
			this.app.log.error({
				message: "replaceChild: wrapper not found",
				data: {
					key,
					newChild,
					availableKeys: this.c.map((c) => c.keyPair.local),
				},
			});
			throw new Error("replaceChild: wrapper not found");
		}

		this.ac.signal.dispatchEvent(new ReplaceChildComponentEvent(key));

		// Remove the old child from the array, and replace it with the new one
		const [oldChild] = this.c.splice(oldChildIndex, 1);

		const { el: wrapper } = oldChild;

		for (const otherChild of this.c) {
			// If we replace a child which contains another child,
			// we have to abort the other child also
			if (oldChild.el.contains(otherChild.el)) {
				this.ac.signal.dispatchEvent(
					new ReplaceChildComponentEvent(otherChild.keyPair.local),
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
	}

	async *waitEvents<
		Fns extends EventAsyncGenerator<GetYieldType<Fns[number]>>[],
	>(...fns: Fns): AsyncGenerator<GetYieldType<Fns[number]>> {
		for await (const ev of combineEventAsyncGenerators(this.ac, ...fns)) {
			yield ev;
		}
	}

	domEvent<K extends keyof HTMLElementEventMap>(
		keyOrElement: string | JSX.Element,
		eventType: K | (string & {}),
		option: DomEventOption = {},
	): EventAsyncGenerator<HTMLElementEventMap[K]> {
		let el: HTMLElement | SVGElement | MathMLElement;
		if (typeof keyOrElement === "string") {
			el = this.getChild(keyOrElement);
		} else {
			if (keyOrElement instanceof DocumentFragment) {
				throw new Error("Cannot attach event to DocumentFragment");
			}
			el = keyOrElement;
		}

		const globalChildKeyPair = this.c.find((c) => c.el === el)?.keyPair;
		this.app.pluginManager.onComponentListening(
			{
				component: this,
				app: this.app,
			},
			this.keyPair,
			globalChildKeyPair,
			eventType,
		);

		return domEvent(el, eventType, {
			preventDefault: option.preventDefault,
			stopPropagation: option.stopPropagation,
			stopImmediatePropagation: option.stopImmediatePropagation,
			fn: option.fn,
		});
	}

	domainEvent<
		EventType extends string,
		DetailType,
		BEE extends typeof DomainEvent<Inner, DetailType>,
		Inner extends string & EventType = EventType,
	>(domainEventClass: BEE): EventAsyncGenerator<InstanceType<BEE>> {
		const et = this.app.getDomainEventTarget(domainEventClass.domainName);
		return domainEvent(et, domainEventClass);
	}

	navigationEvent(): EventAsyncGenerator<NavigationEvent> {
		return navigationEvent(this.app.router.getEventTarget());
	}
}
// @ts-ignore
SeqFlowComponentContext.prototype.createDOMFragment =
	Symbol("createDOMFragment");
