
interface IterOnEventsConfig {
  preventDefault: boolean
  stopPropagation: boolean
  stopImmediatePropagation: boolean
}

const WAKEUP_EVENT = new Event('wakeup')

export function iterOnEvents<T extends Event>(target: EventTarget, eventType: string, config: IterOnEventsConfig): (c: AbortController) => AsyncGenerator<T> {
  async function *iterOnDomEvent(controller: AbortController) {
    const queue: T[] = []

    target.addEventListener(
      eventType,
      (e: Event) => {
        if (config.preventDefault) e.preventDefault()
        if (config.stopPropagation) e.stopPropagation()
        if (config.stopImmediatePropagation) e.stopImmediatePropagation()

        queue.push(e as T);

        controller.signal.dispatchEvent(WAKEUP_EVENT);
      },
      {
        signal: controller.signal,
      }
    );

    while (true) {
      controller.signal.throwIfAborted()

      if (queue.length > 0) {
        yield queue.shift()!
      } else {
        await new Promise<void>((resolve) => {
          controller.signal.addEventListener(
            WAKEUP_EVENT.type,
            () => resolve(),
            {
              once: true,
              signal: controller.signal,
            }
          );
        })
      }
    }
  }

  return iterOnDomEvent
}