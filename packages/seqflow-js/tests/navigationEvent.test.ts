import { expect, test } from 'vitest'
import { start, ComponentParam, NavigationEvent } from '../src/index'

test('navigation even', async () => {
  async function Button({ dom, event }: ComponentParam) {
    dom.render('<input name="path"><button type="button">increment</button>')

    const input = dom.querySelector<HTMLInputElement>('input')

    const events = event.waitEvent(event.domEvent('click'))
    for await (const _ of events) {
      event.navigate(input.value)
    }
  }
  async function app({ dom, event }: ComponentParam) {
    dom.render('<div><div id="button"></div><p id="result"></p></div>')
    dom.child('button', Button)

    const result = dom.querySelector<HTMLParagraphElement>('#result')

    const events = event.waitEvent(event.navigationEvent())
    for await (const event of events) {
      result.textContent = (event as NavigationEvent).path
    }
  }

  start(document.body, app, {
    businessEventBus: {},
    navigationEventBus: new EventTarget()
  })

  const result = document.body.querySelector<HTMLParagraphElement>('#result')!

  document.body.querySelector('input')!.value = '/foo'
  document.body.querySelector('button')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))

  expect(result.textContent).toBe('/foo')

  document.body.querySelector('input')!.value = '/bar'
  document.body.querySelector('button')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))

  expect(result.textContent).toBe('/bar')
})
