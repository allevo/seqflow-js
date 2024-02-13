import { expect, test } from 'vitest'
import { start, ComponentParam, createBusinessEventBus, createDomainEventClass } from '../src/index'

test('dom & business event', async () => {
  const CounterChanged = createDomainEventClass<{ delta: number }>('counter', 'changed')

  async function ChangeButton({ dom, event, data }: ComponentParam<{ delta: number }>) {
    dom.render('<button>Change</button>')
    const events = event.waitEvent(event.domEvent('click'))
    for await (const _ of events) {
      event.dispatchDomainEvent(new CounterChanged({ delta: data.delta }))
    }
  }
  async function app({ dom, event }: ComponentParam) {
    let i = 0

    dom.render(`
<div id="increment"></div>
<div id="decrement"></div>
<button id="reset">Reset</button>
<p id="result">${i}</p>
`)
    dom.child('increment', ChangeButton, { data: { delta: 1 } })
    dom.child('decrement', ChangeButton, { data: { delta: -1 } })

    const result = dom.querySelector<HTMLParagraphElement>('#result')
    const reset = dom.querySelector<HTMLButtonElement>('#reset')

    const events = event.waitEvent(
      event.domEvent('click'),
      event.domainEvent(CounterChanged)
    )
    for await (const event of events) {
      if (event instanceof CounterChanged) {
        i += event.detail.delta
      } else if (event.target === reset) {
        i = 0
      }
      result.textContent = `${i}`
    }
  }

  const c = start(document.body, app, {
    businessEventBus: {
      'counter': createBusinessEventBus()
    },
    navigationEventBus: new EventTarget()
  })


  const increment = document.querySelector('#increment button') as HTMLButtonElement
  const decrement = document.querySelector('#decrement button') as HTMLButtonElement
  const reset = document.querySelector('#reset') as HTMLButtonElement
  const result = document.querySelector('#result') as HTMLParagraphElement

  await new Promise(resolve => setTimeout(resolve, 100))

  increment.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.textContent).toBe('1')

  increment.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.textContent).toBe('2')

  increment.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.textContent).toBe('3')

  decrement.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.textContent).toBe('2')

  decrement.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.textContent).toBe('1')

  decrement.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.textContent).toBe('0')

  decrement.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.textContent).toBe('-1')

  reset.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.textContent).toBe('0')

  c.abort('test')
  await new Promise(resolve => setTimeout(resolve, 10))
})
