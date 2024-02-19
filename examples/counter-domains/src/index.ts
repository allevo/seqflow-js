import { start, ComponentParam } from 'seqflow-js'
import { components, CounterChanged, CounterReset, CounterDomain } from './domains/counter'

import './index.css'

async function main({ dom, event }: ComponentParam) {
  let counter = 0
  dom.render(`
<div></div>
<div id="counter-card">
  <div id="actions">
    <div id="decrement-wrapper"></div>
    <div></div>
    <div id="increment-wrapper"></div>
    <div></div>
    <div id="reset-wrapper"></div>
  </div>
  <div id="counter">${counter}</div>
</div>
<div></div>`)
  dom.child('decrement-wrapper', components.ChangeCounterButton, {
    data: { delta: -1, text: 'Decrement' }
  })
  dom.child('increment-wrapper', components.ChangeCounterButton, {
    data: { delta: 1, text: 'Increment' }
  })
  dom.child('reset-wrapper', components.ResetCounterButton)

  const counterDiv = dom.querySelector('#counter')

  const events = event.waitEvent(
    event.domainEvent(CounterChanged),
    event.domainEvent(CounterReset),
  )
  for await (const ev of events) {
    counterDiv.textContent = `${ev.detail.counter}`
  }
}

start(document.getElementById('root')!, main, {
  log(k) { console.log(k) },
  domains: {
    counter: (eventTarget) => {
      return new CounterDomain(eventTarget)
    }
  }
})
