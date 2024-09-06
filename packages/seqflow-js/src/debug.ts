export function debugEventTarget(et: EventTarget): EventTarget {
	const oldAddEventListener = et.addEventListener;
	et.addEventListener = (
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	) => {
		console.log("addEventListener", type);
		return oldAddEventListener.call(et, type, listener, options);
	};
	const oldDispatchEvent = et.dispatchEvent;
	et.dispatchEvent = (event: Event) => {
		console.log("dispatchEvent", event.type);
		return oldDispatchEvent.call(et, event);
	};

	return et;
}
