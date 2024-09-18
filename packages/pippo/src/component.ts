import { ElementProperty } from ".";
import { EventAsyncGenerator } from "./events";


function applyProps<X extends HTMLElement | SVGElement | MathMLElement>(
	element: X,
	props: null | Record<string, any>,
): X {
	if (props === null) {
		return element;
	}

	const keys = Object.keys(props);
	const keysLength = keys.length;
	for (let i = 0; i < keysLength; i++) {
		const key = keys[i];
		const value = props[key];

		if (value === undefined || value === null) {
			continue;
		}

		if (key === "className") {
			const v: NonNullable<ElementProperty<HTMLElement>["className"]> = value;
			const classes = Array.isArray(v) ? v : [...v.split(" ")];
			element.classList.add(...classes);
		} else if (key === "style") {
			const s: NonNullable<ElementProperty<HTMLElement>["style"]> = value;
			if (typeof s === "string") {
				element.setAttribute("style", s);
			} else {
				for (const styleKey in s) {
					const value = s[styleKey];
					if (value) {
						element.style[styleKey] = value;
					}
				}
			}
		} else if (key === "htmlFor") {
			const h: NonNullable<ElementProperty<HTMLLabelElement>["htmlFor"]> =
				value;
			(element as HTMLLabelElement).htmlFor = h;
		} else {
			const typeValue = typeof value;
			switch (typeValue) {
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
				case "function":
				default:
					break;
			}
		}
	}

	return element;
}

function addChildren(
	el: HTMLElement | SVGAElement | MathMLElement | DocumentFragment,
	children: (string | number | null | undefined | JSX.Element)[],
	appContext: AppContext,
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

function generateId() {
	return Math.random().toString(36).slice(2);
}

type GetYieldType<A extends EventAsyncGenerator<unknown>> = Exclude<
	Awaited<ReturnType<ReturnType<A>["next"]>>,
	IteratorReturnResult<unknown>
>["value"];

export class AppContext {
	log = {
		debug: console.log,
		error: console.error,
	};
}

export class SeqFlowComponentContext {
	// children: components or elements with onClick
	private c: { key: string; el: Element, mounted: boolean }[] = [];

	constructor(
		// mount point
		public _el: HTMLElement | SVGElement | MathMLElement,
		// abort controller
		private ac: AbortController,
		private app: AppContext,
	) {}

	// @ts-ignore
	createDOMFragment: symbol;

	createDOMElement(
		tagNameOrComponentFunction: JSX.ElementType,
		prop: null | {},
		...children: (string | number | null | undefined | JSX.Element)[]
	): JSX.Element {
		let el;
		if (typeof tagNameOrComponentFunction === "string") {
			if (tagNameOrComponentFunction.includes(":")) {
				const [namespace, tagName] = tagNameOrComponentFunction.split(":");
				switch (namespace) {
					case "svg":
						el = applyProps(
							document.createElementNS("http://www.w3.org/2000/svg", tagName),
							prop,
						);
						break;
					case "math":
						el = applyProps(
							document.createElementNS(
								"http://www.w3.org/1998/Math/MathML",
								tagName,
							),
							prop,
						);
						break;
					default:
						throw new Error(`Unknown namespace: ${namespace}`);
				}
			} else {
				el = applyProps(document.createElement(tagNameOrComponentFunction), prop);
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
			el = document.createElement("div");
			const childAbortController = new AbortController();
			const childComponentContext = new SeqFlowComponentContext(
				el,
				childAbortController,
				this.app,
			);

			this.ac.signal.addEventListener("abort", (reason) => {
				childAbortController.abort(reason);
			});

			prop = prop || {};
			// @ts-expect-error
			prop.key = prop && "key" in prop ? (prop.key as string) : generateId();

			const componentName = tagNameOrComponentFunction.name;
			let output;
			try {
				output = tagNameOrComponentFunction(
					{
						...prop,
						children,
					},
					{ component: childComponentContext, app: this.app },
				);
			} catch (e) {
				const err = e as Error;
				this.app.log.error({
					message: "Component throws an error",
					data: {
						componentOption: prop,
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
						this.app.log.debug({
							message: "Component rendering ended",
							data: {
								componentOption: prop,
								componentName: componentName,
							},
						});
					},
					(e) => {
						this.app.log.error({
							message: "Component throws an error",
							data: {
								componentOption: prop,
								componentName,
								errorMessage: e.message,
								error: e,
								stack: e.stack,
							},
						});
					},
				);
			} else {
				this.app.log.debug({
					message: "Component rendering ended",
					data: {
						componentOption: prop,
						componentName: componentName,
					},
				});
			}
		} else {
			throw new Error("Unknown type");
		}

		if (prop && "key" in prop && !(el instanceof DocumentFragment)) {
			const key = prop.key as string;
			this.c.push({
				key: key,
				el,
				mounted: false,
			});
		}

		if (prop && "onClick" in prop && el instanceof HTMLElement) {
			const onClick = prop.onClick as NonNullable<
				ElementProperty<HTMLElement>
			>["onClick"];
			const k = "key" in prop ? (prop.key as string) : generateId();
			const elAbortController = new AbortController();
			this.ac.signal.addEventListener("abort", () => {
				elAbortController.abort();
			});
			this.ac.signal.addEventListener(`abort-component-${k}`, () => {
				elAbortController.abort();
			});
			this.c.push({
				key: k,
				el,
				mounted: false,
			});
			el.addEventListener("click", onClick!, {
				signal: elAbortController.signal,
			});
		}

		if (typeof tagNameOrComponentFunction !== 'function') {
			addChildren(el, children, this.app);
		}

		return el;
	}

	renderSync(element: string | number | null | undefined | JSX.Element) {
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
				this.ac.signal.dispatchEvent(new Event(`abort-component-${c.key}`));
			}
			return !c.mounted
		});

		// This means we want to remove all children
		// keep the only the wrapper
		if (element === null || element === undefined) {
			return;
		} else {
			switch (typeof element) {
				case "string":
				case "number":
					this._el.appendChild(document.createTextNode(element.toString()));
					break;
				case "object":
					if (!(element instanceof Node)) {
						this.app.log.error({
							message: "renderSync: invalid element",
							data: { element },
						});
						break;
					}
				default:
					this._el.appendChild(element as Node);
					break;
			}
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
		const child = this.c.find((c) => c.key === key);
		if (child) {
			return child.el as E;
		}
		return null;
	}

	replaceChild(
		key: string,
		newChild: () => JSX.Element | Promise<JSX.Element>,
	): void | Promise<void> {
		const oldChildIndex = this.c.findIndex((c) => c.key === key);
		if (oldChildIndex < 0) {
			this.app.log.error({
				message: "replaceChild: wrapper not found",
				data: {
					key,
					newChild,
					availableKeys: this.c.map((c) => c.key),
				},
			});
			throw new Error("replaceChild: wrapper not found");
		}

		this.ac.signal.dispatchEvent(
			new Event(`abort-component-${key}`),
		);

		// Remove the old child from the array, and replace it with the new one
		const [oldChild] = this.c.splice(oldChildIndex, 1);

		const { el: wrapper } = oldChild;

		for (const otherChild of this.c) {
			// If we replace a child which contains another child,
			// we have to abort the other child also
			if (oldChild.el.contains(otherChild.el)) {
				this.app.log.debug({
					message: "replaceChild: wrapper contains other child",
					data: { parent: key, child: otherChild.key },
				});
				this.ac.signal.dispatchEvent(
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
	}


}
// @ts-ignore
SeqFlowComponentContext.prototype.createDOMFragment =
	Symbol("createDOMFragment");