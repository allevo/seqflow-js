
export function debugEventTarget(et: EventTarget, log: (_: Event) => void = console.log): EventTarget {
	const oldAddEventListener = et.addEventListener;
	et.addEventListener = (
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	) => {
		return oldAddEventListener.call(et, type, listener, options);
	};
	const oldDispatchEvent = et.dispatchEvent;
	et.dispatchEvent = (event: Event) => {
		log(event);
		return oldDispatchEvent.call(et, event);
	};

	return et;
}
