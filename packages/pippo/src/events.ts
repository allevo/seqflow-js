import type { DomainEvent } from "./domains";
import { NavigationEvent } from "./router";

export type EventAsyncGenerator<T> = (
	abortController: AbortController,
) => AsyncGenerator<T>;

export type GetYieldType<A extends EventAsyncGenerator<unknown>> = Exclude<
	Awaited<ReturnType<ReturnType<A>["next"]>>,
	IteratorReturnResult<unknown>
>["value"];

const wakeupEventName = "wakeup";
export const WAKEUP_EVENT = new Event(wakeupEventName);

export function createAbortableEventAsyncGenerator<E extends Event>(
	et: EventTarget,
	eventType: string,
	options: {
		preventDefault?: boolean;
		stopPropagation?: boolean;
		stopImmediatePropagation?: boolean;
		fn?: (ev: E) => boolean | undefined;
	},
): EventAsyncGenerator<E> {
	// @ts-ignore
	async function* iterOnEvents(abortController: AbortController) {
		// If already aborted, throw immediately
		abortController.signal.throwIfAborted();

		// When the abort contoller is aborted, we dispatch the WAKEUP_EVENT
		// So, in the next loop, the promise will be resolved and
		// in the next iteration, the loop will check if the controller is aborted
		// and throw an error
		abortController.signal.addEventListener(
			"abort",
			() => {
				abortController.signal.dispatchEvent(WAKEUP_EVENT);
			},
			{
				once: true,
			},
		);

		const queue: E[] = [];
		et.addEventListener(
			eventType,
			(event) => {
				// This run synchronously a function
				// The function can call the event.preventDefault() method under conditions
				if (options.fn) {
					const ret = options.fn(event as E);
					if (ret === true) {
						return;
					}
				}

				if (options.preventDefault) {
					event.preventDefault();
				}
				if (options.stopPropagation) {
					event.stopPropagation();
				}
				if (options.stopImmediatePropagation) {
					event.stopImmediatePropagation();
				}
				queue.push(event as E);
				abortController.signal.dispatchEvent(WAKEUP_EVENT);
			},
			{
				signal: abortController.signal,
			},
		);

		// In this loop, we wait for the event to be dispatched
		// The queue is filled with the events, so we can yield them
		// Anyway, when there are no events, we wait for the WAKEUP_EVENT
		// WAKEUP_EVENT is dispatched when:
		// - the abort controller is aborted
		// - an new event is added to the queue is dispatched
		while (true) {
			abortController.signal.throwIfAborted();

			if (queue.length > 0) {
				const ev = queue.shift();
				if (ev) {
					yield ev;
				}
			} else {
				await new Promise<Event>((resolve) => {
					abortController.signal.addEventListener(WAKEUP_EVENT.type, resolve, {
						once: true,
					});
				});
			}
		}
	}

	return iterOnEvents;
}

export async function* combineEventAsyncGenerators<
	Fns extends EventAsyncGenerator<GetYieldType<Fns[number]>>[],
>(
	abortController: AbortController,
	...fns: Fns
): AsyncGenerator<GetYieldType<Fns[number]>> {
	if (fns.length === 0) {
		throw new Error("No generator functions provided");
	}

	const combineEventAsyncGeneratorAbortController = new AbortController();

	// This is the case when we have only one generator
	// This is the simple case, we just return the generator
	if (fns.length === 1) {
		abortController.signal.addEventListener("abort", (r) => {
			combineEventAsyncGeneratorAbortController.abort(r);
		});
		const g = fns[0](combineEventAsyncGeneratorAbortController);
		for await (const e of g) {
			yield e;
			/* v8 ignore next 4 */
		}
		// unreachable
		return;
	}

	abortController.signal.addEventListener("abort", (r) => {
		combineEventAsyncGeneratorAbortController.signal.dispatchEvent(
			WAKEUP_EVENT,
		);
		combineEventAsyncGeneratorAbortController.abort(r);
	});

	const queue: unknown[] = [];
	Promise.all(
		fns.map((fn) => {
			return (async () => {
				try {
					for await (const value of fn(
						combineEventAsyncGeneratorAbortController,
					)) {
						queue.push(value);
						combineEventAsyncGeneratorAbortController.signal.dispatchEvent(
							WAKEUP_EVENT,
						);
					}
				} catch (e) {
					// ignore error
				}
			})();
		}),
	);

	while (true) {
		combineEventAsyncGeneratorAbortController.signal.throwIfAborted();

		if (queue.length > 0) {
			yield queue.shift() as GetYieldType<Fns[number]>;
		} else {
			await new Promise<void>((resolve) => {
				combineEventAsyncGeneratorAbortController.signal.addEventListener(
					WAKEUP_EVENT.type,
					() => resolve(),
					{
						once: true,
					},
				);
			});
		}
	}
}

export type CustomEventAsyncGenerator<E> = EventAsyncGenerator<E> & {
	push: (ev: E) => void;
};
export function createCustomEventAsyncGenerator<
	E,
>(): CustomEventAsyncGenerator<E> {
	const queue: E[] = [];

	const pipeAbortController = new AbortController();
	async function* iterOnEvents(abortController: AbortController) {
		// If already aborted, throw immediately
		abortController.signal.throwIfAborted();
		abortController.signal.addEventListener("abort", () => {
			pipeAbortController.abort();
			pipeAbortController.signal.dispatchEvent(WAKEUP_EVENT);
		});

		while (true) {
			pipeAbortController.signal.throwIfAborted();

			if (queue.length > 0) {
				const ev = queue.shift();
				if (ev) {
					yield ev;
				}
			} else {
				await new Promise<void>((resolve) => {
					pipeAbortController.signal.addEventListener(
						wakeupEventName,
						() => resolve(),
						{
							once: true,
						},
					);
				});
			}
		}
	}

	iterOnEvents.push = (ev: E) => {
		queue.push(ev);
		pipeAbortController.signal.dispatchEvent(WAKEUP_EVENT);
	};

	return iterOnEvents;
}

export function domEvent<K extends keyof HTMLElementEventMap>(
	el: HTMLElement | SVGElement | MathMLElement,
	eventType: K | (string & {}),
	options: {
		preventDefault?: boolean;
		stopPropagation?: boolean;
		stopImmediatePropagation?: boolean;
		fn?: (ev: HTMLElementEventMap[K]) => boolean | undefined;
	},
): EventAsyncGenerator<HTMLElementEventMap[K]> {
	return createAbortableEventAsyncGenerator(el, eventType, options);
}

export function domainEvent<
	EventType extends string,
	DetailType,
	BEE extends typeof DomainEvent<Inner, DetailType>,
	Inner extends string & EventType = EventType,
>(eventTarget: EventTarget, b: BEE): EventAsyncGenerator<InstanceType<BEE>> {
	return createAbortableEventAsyncGenerator(eventTarget, b.t, {
		preventDefault: false,
	});
}

export function navigationEvent(
	eventTarget: EventTarget,
): EventAsyncGenerator<NavigationEvent> {
	return createAbortableEventAsyncGenerator(
		eventTarget,
		NavigationEvent.eventType,
		{
			preventDefault: false,
		},
	);
}
