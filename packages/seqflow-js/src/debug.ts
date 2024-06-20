export function debugEventTarget(ev: EventTarget): EventTarget {
	const oldAddEventListener = ev.addEventListener;
	ev.addEventListener = (
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	) => {
		console.log("addEventListener", type);
		return oldAddEventListener.call(ev, type, listener, options);
	};
	const oldDispatchEvent = ev.dispatchEvent;
	ev.dispatchEvent = (event: Event) => {
		console.log("dispatchEvent", event.type);
		return oldDispatchEvent.call(ev, event);
	};

	return ev;
}
