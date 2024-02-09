import jsdom from 'jsdom'

export function createFakeDom() {
  const dom = new jsdom.JSDOM('<!DOCTYPE html><body id="root"></body>', { resources: 'usable', runScripts: 'dangerously', })
  global.AbortController = dom.window.AbortController
  global.AbortSignal = dom.window.AbortSignal
  global.Event = dom.window.Event
  global.CustomEvent = dom.window.CustomEvent
  global.EventTarget = dom.window.EventTarget
  return dom
}
