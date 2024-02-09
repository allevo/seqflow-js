import { expect, test } from 'vitest'
import { start, ComponentParam } from '../src/index'

test('dom event self', async () => {
  async function app({ render, querySelector, waitEvent, domEvent }: ComponentParam) {
    render('<button type="button">increment</button><p id="result"></p>')

    const result = querySelector<HTMLParagraphElement>('#result')

    let i = 0
    const events = waitEvent(domEvent('click'))
    for await (const _ of events) {
      result.textContent = `${++i}`
    }
  }

  start(document.body, app)
  expect(document.body.innerHTML).toBe('<button type="button">increment</button><p id="result"></p>')

  document.body.querySelector('button')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))

  expect(document.body.innerHTML).toBe('<button type="button">increment</button><p id="result">1</p>')

  document.body.querySelector('button')!.click()
  document.body.querySelector('button')!.click()
  document.body.querySelector('button')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))

  expect(document.body.innerHTML).toBe('<button type="button">increment</button><p id="result">4</p>')
})

/*
test('dom event multi', async () => {

  async function app({ render, querySelector, waitEvent, domEvent }: ComponentParam) {
    render(`
<button type="button" id="increment">increment</button>
<button type="button" id="decrement">decrement</button>
<p id="result"></p>
`)

    const result = querySelector<HTMLParagraphElement>('#result')
    const increment = querySelector<HTMLButtonElement>('#increment')
    const decrement = querySelector<HTMLButtonElement>('#decrement')

    let i = 0
    const events = waitEvent(domEvent('click'))
    for await (const event of events) {
      if (event.target === increment) {
        result.textContent = `${++i}`
      } else if (event.target === decrement) {
        result.textContent = `${--i}`
      } else {
        throw new Error('unknown event')
      }
    }

  }

  start(document.body, app)

  const result = document.body.querySelector<HTMLParagraphElement>('#result')!

  document.body.querySelector<HTMLButtonElement>('#increment')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))

  expect(result.innerHTML).toBe('1')

  document.body.querySelector<HTMLButtonElement>('#increment')!.click()
  document.body.querySelector<HTMLButtonElement>('#increment')!.click()
  document.body.querySelector<HTMLButtonElement>('#increment')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))

  expect(result.innerHTML).toBe('4')

  document.body.querySelector<HTMLButtonElement>('#decrement')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.innerHTML).toBe('3')
})

test('dom event child', async () => {
  async function Button({ render }: ComponentParam) {
    render('<button type="button">increment</button>')
  }
  async function app({ render, querySelector, waitEvent, domEvent, child }: ComponentParam) {
    let i = 0

    render(`<div id="wrapper"></div><p id="result">${i}</p>`)
    child('wrapper', Button)

    const result = querySelector<HTMLParagraphElement>('#result')

    const events = waitEvent(domEvent('click'))
    for await (const ev of events) {
      i++
      result.textContent = `${i}`
    }
  }

  start(document.body, app)
  const result = document.body.querySelector<HTMLParagraphElement>('#result')!
  expect(result.innerHTML).toBe('0')
  await new Promise(resolve => setTimeout(resolve, 10))

  document.body.querySelector('button')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.innerHTML).toBe('1')

  document.body.querySelector('button')!.click()
  document.body.querySelector('button')!.click()
  document.body.querySelector('button')!.click()
  await new Promise(resolve => setTimeout(resolve, 10))
  expect(result.innerHTML).toBe('4')
})
*/