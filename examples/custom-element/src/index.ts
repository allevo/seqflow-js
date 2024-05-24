import { start } from "seqflow-js";
import { Counter, CounterDomain } from "./Counter";

import { ExternalChangeValue } from "./external";

declare global {
	// `vite` build replaces `shadowDomMode` with the correct value
	export const shadowDomMode: ShadowRootMode | false;
	// `vite` plugin replaces `injectCSS` with the correct function
	export const injectCSS: (shadow: ShadowRoot) => void;
}

class CounterElement extends HTMLElement {
	private abortController?: AbortController;
	private externalEventTarget = new EventTarget();

	// This method is called when the element is added to the DOM
	connectedCallback() {
		const div = document.createElement("div");
		if (shadowDomMode) {
			const shadow = this.attachShadow({
				mode: shadowDomMode,
			});
			if (typeof injectCSS === "function") {
				injectCSS(shadow);
			}
			shadow.appendChild(div);
		} else {
			this.appendChild(div);
		}

		// Get the initial value from the attribute or default to 20
		const initialValue = Number(this.getAttribute("value") || "20");

		// Start the Seqflow app
		// Even if `ShadowRoot` is not a `HTMLElement`, we can cast it to `HTMLElement` to make TypeScript happy.
		// It works anyway.
		this.abortController = start(div, Counter, undefined, {
			log: {
				error: (l) => {
					throw l;
				},
				info: (l) => console.info(l),
				debug: (l) => console.debug(l),
			},
			domains: {
				// Create the Counter domain with the initial value and the external event target
				counter: (et) =>
					new CounterDomain(et, this.externalEventTarget, initialValue),
				// `external` domain is a fake domain and used only to ntofy attribute changes
				external: () => this.externalEventTarget,
			},
		});
	}

	// We want to be notified when the `value` attribute changes
	static get observedAttributes() {
		return ["value"];
	}

	// This method is called when the `value` attribute changes
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		this.externalEventTarget.dispatchEvent(
			new ExternalChangeValue({
				newValue: Number(newValue),
			}),
		);
	}

	// This method is called when the element is removed from the DOM
	disconnectedCallback() {
		if (this.abortController) {
			this.abortController.abort("Unmounting");
		}
	}
}

declare module "seqflow-js" {
	interface Domains {
		counter: CounterDomain;
		external: EventTarget;
	}
}

customElements.define("my-counter-element", CounterElement);
