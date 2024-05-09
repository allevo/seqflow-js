export type EventAsyncGenerator<T> = (
	abortController: AbortController,
) => AsyncGenerator<T>;

const wakeupEventName = "wakeup";
export const WAKEUP_EVENT = new Event(wakeupEventName);

export function yieldEvent<E extends Event>(
	eventType: string,
	options: {
		el: EventTarget;
		preventDefault: boolean;
	},
): EventAsyncGenerator<E> {
	async function* iterOnEvents(abortController: AbortController) {
		// If already aborted, throw immediately
		abortController.signal.throwIfAborted();

		const queue: E[] = [];
		options.el.addEventListener(
			eventType,
			(event) => {
				if (options.preventDefault) {
					event.preventDefault();
				}
				queue.push(event as E);
				abortController.signal.dispatchEvent(WAKEUP_EVENT);
			},
			{
				signal: abortController.signal,
			},
		);

		while (true) {
			abortController.signal.throwIfAborted();

			if (queue.length > 0) {
				const ev = queue.shift();
				if (ev) {
					yield ev;
				}
			} else {
				await new Promise<void>((resolve) => {
					abortController.signal.addEventListener(
						wakeupEventName,
						() => resolve(),
						{
							once: true,
							signal: abortController.signal,
						},
					);
				});
			}
		}
	}

	return iterOnEvents;
}

export async function* combineEvents<T>(
	childAbortController: AbortController,
	...fns: EventAsyncGenerator<T>[]
): AsyncGenerator<T> {
	if (fns.length === 0) {
		throw new Error("waitEvent needs at least one argument");
	}

	const waitEventsAbortController = new AbortController();

	if (fns.length === 1) {
		childAbortController.signal.addEventListener("abort", () => {
			waitEventsAbortController.abort();
		});
		const g = fns[0](waitEventsAbortController);
		for await (const e of g) {
			yield e;
		}
	}
	const queue: unknown[] = [];

	Promise.all(
		fns.map((fn) => {
			const it = fn(waitEventsAbortController);

			return (async () => {
				for await (const value of it) {
					queue.push(value);
					waitEventsAbortController.signal.dispatchEvent(WAKEUP_EVENT);
				}
			})();
		}),
	);

	while (true) {
		waitEventsAbortController.signal.throwIfAborted();

		if (queue.length > 0) {
			yield queue.shift() as Awaited<T>;
		} else {
			await new Promise<void>((resolve) => {
				waitEventsAbortController.signal.addEventListener(
					WAKEUP_EVENT.type,
					() => resolve(),
					{
						once: true,
						signal: waitEventsAbortController.signal,
					},
				);
			});
		}
	}
}
