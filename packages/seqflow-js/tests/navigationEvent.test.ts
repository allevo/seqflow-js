import { expect, test } from 'vitest'
import { start, ComponentParam, NavigationEvent } from '../src/index'

test('navigation even', async () => {
  async function Button({ render, waitEvent, domEvent, querySelector, navigate }: ComponentParam) {
    render('<input name="path"><button type="button">increment</button>')

    const input = querySelector<HTMLInputElement>('input')

    const events = waitEvent(domEvent('click'))
    for await (const _ of events) {
      navigate(input.value)
    }
  }
  async function app({ render, child, querySelector, waitEvent, navigationEvent }: ComponentParam) {
    render('<div><div id="button"></div><p id="result"></p></div>')
    child('button', Button)

    const result = querySelector<HTMLParagraphElement>('#result')

    const events = waitEvent(navigationEvent())
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
