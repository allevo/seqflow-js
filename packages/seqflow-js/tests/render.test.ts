import { expect, test } from 'vitest'
import {
  getByText,
  waitFor,
} from '@testing-library/dom'

import { start, ComponentParam } from '../src/index'

test('render self', () => {
  async function app({ render }: ComponentParam) {
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
  async function Header({ render }: ComponentParam) {
    render('<div>header</div>')
  }
  async function Main({ render }: ComponentParam) {
    render('<div>main</div>')
  }

  async function app({ render, child }: ComponentParam) {
    render('<div id="header"></div><main id="main"></main>')
    child('header', Header)
    child('main', Main)
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
  async function app({ render, child }: ComponentParam) {
    render('<div id="header"></div><main id="main"></main>')
    ;(child as any)()
  }

  start(document.body!, app, {
    log(l) { },
    businessEventBus: {},
    navigationEventBus: new EventTarget(),
  })
})
