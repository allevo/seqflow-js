import { expect, test } from 'vitest'
import { start, ComponentParam, createBusinessEventBus, createDomainEventClass } from '../src/index'

test('domain even', async () => {
  const CounterChanged = createDomainEventClass<null>('counter', 'changed')

  async function Button({ render, waitEvent, domEvent, dispatchDomainEvent: dispatchBusinessEvent }: ComponentParam) {
    render('<button type="button">increment</button>')

    const events = waitEvent(domEvent('click'))
    for await (const _ of events) {
      dispatchBusinessEvent(new CounterChanged(null))
    }
  }
  async function app({ render, child, querySelector, waitEvent, businessEvent }: ComponentParam) {
    let i = 0
    render(`<div><div id="button"></div><p id="result">${i}</p></div>`)
    child('button', Button)

    const result = querySelector<HTMLParagraphElement>('#result')

    const events = waitEvent(businessEvent(CounterChanged))
    for await (const _ of events) {
      i++
      result.textContent = `${i}`
    }
  }

  start(document.body, app, {
    log(l) { },
    businessEventBus: {
      'counter': createBusinessEventBus()
    },
    navigationEventBus: new EventTarget()
  })

  document.body.querySelector('button')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))

  expect(document.body.innerHTML).toBe('<div><div id="button"><button type="button">increment</button></div><p id="result">1</p></div>')

  document.body.querySelector('button')!.click()
  document.body.querySelector('button')!.click()
  document.body.querySelector('button')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(document.body.innerHTML).toBe('<div><div id="button"><button type="button">increment</button></div><p id="result">4</p></div>')
})