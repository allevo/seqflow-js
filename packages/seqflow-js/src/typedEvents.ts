import { type EventAsyncGenerator, yieldEvent } from "./events";
import type { DomainEvent } from "./index";
import type { NavigationEvent } from "./router";

export function domEvent<K extends keyof HTMLElementEventMap>(
	eventType: K | (string & {}),
	options: {
		el: HTMLElement;
		preventDefault: boolean;
		stopPropagation?: boolean;
		stopImmediatePropagation?: boolean;
		fn?: (ev: HTMLElementEventMap[K]) => void;
	},
): EventAsyncGenerator<HTMLElementEventMap[K]> {
	return yieldEvent(eventType, options);
}

export function domainEvent<DE extends DomainEvent<unknown>>(
	eventType: string,
	eventTarget: EventTarget,
): EventAsyncGenerator<DE> {
	return yieldEvent(eventType, {
		el: eventTarget,
		preventDefault: false,
	});
}

export function navigationEvent(
	eventTarget: EventTarget,
): EventAsyncGenerator<NavigationEvent> {
	return yieldEvent("navigation", {
		el: eventTarget,
		preventDefault: false,
	});
}
