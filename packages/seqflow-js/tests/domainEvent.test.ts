import { expect, test } from 'vitest'
import { start, ComponentParam, createBusinessEventBus, createDomainEventClass } from '../src/index'

test('domain even', async () => {
  const CounterChanged = createDomainEventClass<null>('counter', 'changed')

  async function Button({ dom, event }: ComponentParam) {
    dom.render('<button type="button">increment</button>')

    const events = event.waitEvent(event.domEvent('click'))
    for await (const _ of events) {
      event.dispatchDomainEvent(new CounterChanged(null))
    }
  }
  async function app({ dom, event }: ComponentParam) {
    let i = 0
    dom.render(`<div><div id="button"></div><p id="result">${i}</p></div>`)
    dom.child('button', Button)

    const result = dom.querySelector<HTMLParagraphElement>('#result')

    const events = event.waitEvent(event.domainEvent(CounterChanged))
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