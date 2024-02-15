import { iterOnEvents } from "./event-utils"

const CHILD_OPTION_ERROR = 'This component has no input data' as const
export type ChildOption<T = unknown> = unknown extends T ? typeof CHILD_OPTION_ERROR : {
  data: T,
}

let _abortControllerId = 0
function generateAbortController() {
  const controller = new AbortController()
  ;(controller as any).id = _abortControllerId++

  return controller
}

export class DomainEvent<T> extends Event implements CustomEvent<T> {
  static domainName: string
  static t: string
  detail: T;

  constructor(detail: T, eventType: string = '') {
    super(eventType, { bubbles: true })
    this.detail = detail
  }

  /* v8 ignore next 3 */
  initCustomEvent(): void {
    throw new Error('Method not implemented.');
  }
}
export type GetDataType<T> = T extends DomainEvent<infer R> ? R : never
export type GetArrayOf<T> = () => T[]

export function createDomainEventClass<T>(domainName: string, type: string) {
  class CustomBusinessEvent extends DomainEvent<T> {
    static readonly domainName = domainName
    static readonly t = type

    constructor(detail: T) {
      super(detail, type)
    }
  }
  return CustomBusinessEvent
}

export interface ComponentParam<T = unknown> {
  data: unknown extends T ? 'This component don\'t defined the data type' : T
  signal: AbortSignal
  _controller: AbortController
  dom: {
    render(html: string): void
    querySelector<E = HTMLElement>(selector: string): E
    child(
      id: string,
      fn: ComponentFn<unknown>,
    )
    child<E>(
      id: string,
      fn: ComponentFn<E>,
      option: ChildOption<E>
    )
  }
  event: {
    dispatchDomainEvent<D, BE extends DomainEvent<D> = DomainEvent<D>>(event: BE)
    dispatchEvent(event: Event): void
    domEvent<K extends keyof HTMLElementEventMap>(type: K, filter?: (el: HTMLElementEventMap[K]) => boolean): (controller: AbortController) => AsyncGenerator<Event>
    domainEvent<BEE extends typeof DomainEvent<any>>(b: BEE): (b: AbortController) => AsyncGenerator<InstanceType<BEE>>
    navigationEvent(): (controller: AbortController) => AsyncGenerator<Event>
    navigate(path: string)
    waitEvent<T extends Event[]>(...fns: {
      [I in keyof T]: (controller: AbortController) => AsyncGenerator<T[I]>
    }): AsyncGenerator<T[number]>
  }
}
interface ComponentFn<T = unknown> {
  (param: ComponentParam<T>): Promise<void>;
}

let _config: GlobalConfiguration = {
  businessEventBus: {},
  navigationEventBus: new EventTarget()
}
function Component<T = unknown>(
  el: HTMLElement,
  fn: (p: ComponentParam<T>) => Promise<void>,
  option?: ChildOption<T>
) {
  let controller = generateAbortController()
  let children = {} as Record<string, ReturnType<typeof Component>>

  controller.signal.addEventListener('abort', () => {
    for (const mountPoint in children) {
      _config.log?.({
        msg: 'Aborting child component',
        data: {
          parent: fn.name,
          child: mountPoint,
        }
      })
      children[mountPoint]._controller.abort('Parent controller aborted')
    }
  })

  _config.log?.({
    msg: 'Component Mounted',
    data: {
      name: fn.name,
      id: (controller as any).id
    }
  })

  let isFirstRender = true
  const b: Omit<ComponentParam<T>, 'data'> = {
    dom: {
      render(html: string) {
        _config.log?.({
          msg: 'Rendering component',
          data: {
            name: fn.name,
            isFirstRender,
          }
        })

        if (!isFirstRender) {
          controller.abort('Rerendering the component')

          for (const mountPoint in children) {
            _config.log?.({
              msg: 'Aborting child component',
              data: {
                parent: fn.name,
                child: mountPoint,
                isFirstRender,
              }
            })
            children[mountPoint]._controller.abort('Rerendering the component')
          }

          isFirstRender = false

          controller = generateAbortController()
        }

        el.innerHTML = html;

        _config.log?.({
          msg: 'Component rendered',
          data: {
            name: fn.name,
          }
        })
      },  
      querySelector<T = HTMLElement>(selector): T {
        return el.querySelector(selector);
      },
      child() {
        let id
        let childFn
        let option
        if (arguments.length === 2) {
          id = arguments[0] as string
          childFn = arguments[1] as ComponentFn<T>
        } else if (arguments.length === 3) {
          id = arguments[0] as string
          childFn = arguments[1] as ComponentFn<T>
          option = arguments[2] as ChildOption<T>
        } else {
          throw new Error('Invalid number of arguments')
        }

        _config.log?.({
          msg: 'Mounting child component',
          data: {
            parent: fn.name,
            mountPoint: id,
            child: childFn.name,
          }
        })

        const el2 = el.querySelector(`#${id}`)! as HTMLElement;
        children[id] = Component(el2, childFn, option)
      },
    },
    event: {
      navigationEvent() {
        return iterOnEvents<NavigationEvent>(_config.navigationEventBus, 'navigate', {
          preventDefault: true,
          stopPropagation: true,
          stopImmediatePropagation: false,
        })
      },
  
      domainEvent<BEE extends typeof DomainEvent<any>>(b: BEE): (b: AbortController) => AsyncGenerator<InstanceType<BEE>> {
        const domainKey = b.domainName
        const type = b.t
  
        _config.log?.({
          msg: 'Waiting for Business event',
          data: {
            name: fn.name,
            isFirstRender,
            domainKey,
            type,
          }
        })
  
        return iterOnEvents<InstanceType<BEE>>(_config.businessEventBus[domainKey], type, {
          preventDefault: false,
          stopPropagation: false,
          stopImmediatePropagation: false,
        })
      },
      domEvent<K extends keyof HTMLElementEventMap>(type: K, filter?: (el: HTMLElementEventMap[K]) => boolean) {
        _config.log?.({
          msg: 'Waiting for DOM event ' + type,
          data: {
            name: fn.name,
            isFirstRender,
          }
        })
  
        return iterOnEvents<HTMLElementEventMap[K]>(el, type, {
          preventDefault: true,
          stopPropagation: true,
          stopImmediatePropagation: false,
        })
      },
      waitEvent<T extends Event[]>(...fns: {
        [I in keyof T]: (controller: AbortController) => AsyncGenerator<T[I]>
      }): AsyncGenerator<T[number]> {
        _config.log?.({
          msg: 'Waiting for event',
          data: {
            name: fn.name,
            isFirstRender,
          }
        })
  
        const _controller = generateAbortController()
  
        controller.signal.addEventListener('abort', () => {
          _controller.abort('Parent controller aborted')
        }, {
          once: true
        })
  
        if (fns.length === 0) {
          throw new Error('waitEvent needs at least one argument')
        }
  
        if (fns.length === 1) {
          return fns[0](_controller)
        }
  
        const queue: Event[] = []
  
        const controllers = [] as AbortController[]
  
        Promise.all(fns.map(fn => {
          const c = generateAbortController()
          controllers.push(c)
          const it = fn(c)
          return (async () => {
            let result = await it.next()
            while (!result.done) {
              queue.push(result.value)
              _controller.signal.dispatchEvent(new Event('wakeup'))
              result = await it.next()
            }
          })()
        }))
          .catch(e => {
            console.error('ERROR', e)
          })
  
        return (async function *() {
          while (true) {
            _controller.signal.throwIfAborted()
  
            if (queue.length > 0) {
              yield queue.shift()!
            } else {
              await new Promise<void>((resolve) => {
                _controller.signal.addEventListener(
                  'wakeup',
                  () => resolve(),
                  {
                    once: true,
                    signal: _controller.signal,
                  }
                );
              })
            }
          }
        })()
      },
      navigate(path: string) {
        _config.log?.({
          msg: 'Navigating',
          data: {
            name: fn.name,
            path,
          }
        })
        if (path.startsWith('http')) {
          const url = new URL(path)
          path = url.pathname + url.search
        }
  
        _config.navigationEventBus.dispatchEvent(new NavigationEvent(path))
        window.history.pushState({}, '', path)
      },
      dispatchEvent(event: Event) {
        _config.log?.({
          msg: 'Dispatching event',
          data: {
            name: fn.name,
            eventType: event.type,
          }
        })
        el.dispatchEvent(event);
      },
      dispatchDomainEvent<D, BE extends DomainEvent<D> = DomainEvent<D>>(event: BE) {
        const domainName = (event.constructor as typeof DomainEvent<D>).domainName
        _config.log?.({
          msg: 'Dispatching business event',
          data: {
            name: fn.name,
            domainName,
            eventType: event.type,
          }
        })
        _config.businessEventBus[domainName].dispatchEvent(event);
      },
    },
    _controller: controller,
    signal: controller.signal,
  };

  if (option && option !== CHILD_OPTION_ERROR) {
    ;(b as ComponentParam<{}>).data = option.data as {};
  }

  fn(b as ComponentParam<T>).then(
    () => {
      _config.log?.({
        msg: 'ENDED!',
        data: {
          name: fn.name,
          id: (controller as any).id
        }
      })
    },
    (e) => {
      /* v8 ignore next 9 */
      _config.log?.({
        msg: 'ENDED!',
        data: {
          name: fn.name,
          id: (controller as any).id,
          error: e
        }
      })
    }
  );

  return b as ComponentParam<T>
}

interface GlobalConfiguration {
  log?: (log: {
    msg: string
  } & any) => void
  businessEventBus: BusinessEventBus
  navigationEventBus: EventTarget
}

export function start(el: HTMLElement, fn: ComponentFn, config?: GlobalConfiguration) {
  _config = config || {
    businessEventBus: {},
    navigationEventBus: new EventTarget()
  }
  const a = Component(el, fn);

  a._controller.signal.addEventListener('abort', () => {
    _config.log?.({
      msg: 'Component aborted',
      data: {
        name: fn.name,
      }
    })

    _config = {
      businessEventBus: {},
      navigationEventBus: new EventTarget()
    }
  })

  return a._controller
}

export function createBusinessEventBus(): EventTarget {
  return new EventTarget()
}
export interface BusinessEventBus {
  [key: string]: EventTarget
}

export class NavigationEvent extends Event {
  constructor(public readonly path: string) {
    super('navigate', { bubbles: false })
  }
}

// 76-81,196-197,239-240,264,298-315,331-336,340-348,351-356,371-372,375-381,397-402,405-413
