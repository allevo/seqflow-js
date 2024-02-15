import { expect, test } from 'vitest'
import {
  getByText,
  waitFor,
} from '@testing-library/dom'

import { start, ComponentParam } from '../src/index'

test('render self', () => {
  async function app({ dom: { render } }: ComponentParam) {
    render('<div>hello</div>')
  }

  start(document.body!, app, {
    log(l) { },
    businessEventBus: {},
    navigationEventBus: new EventTarget(),
  })

  expect(document.body.innerHTML).toBe('<div>hello</div>')
})


test('render child', async () => {
  async function Header({ dom: { render } }: ComponentParam) {
    render('<div>header</div>')
  }
  async function Main({ dom: { render }, data }: ComponentParam<{ text: string }>) {
    render(`<div>${data.text}</div>`)
  }

  async function app({ dom: { render, child } }: ComponentParam) {
    render('<div id="header"></div><main id="main"></main>')
    child('header', Header)
    child('main', Main, {
      data: { text: 'main' }
    })
  }

  start(document.body!, app, {
    log(l) { },
    businessEventBus: {},
    navigationEventBus: new EventTarget(),
  })

  await waitFor(() => getByText(document.body, 'main'))
  await waitFor(() => getByText(document.body, 'header'))

  expect(document.body.innerHTML).toBe('<div id="header"><div>header</div></div><main id="main"><div>main</div></main>')
})

test('render child throw error on wrong argument', async () => {
  async function app({ dom: { render, child } }: ComponentParam) {
    render('<div id="header"></div><main id="main"></main>')
    ;(child as any)()
  }

  start(document.body!, app, {
    log(l) { },
    businessEventBus: {},
    navigationEventBus: new EventTarget(),
  })
})
