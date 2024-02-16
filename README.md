# SeqFlow JS

SeqFlowJS is a JavaScript library for creating and managing frontend workflows. The core ideas are:
- Linearity over Complex Abstractions
- Explicitness over Implicitiveness

## Installation

```bash
npm install seqflow-js
```

## Usage

```ts
import { start, ComponentParam } from 'seqflow-js'

async function main({ dom, event }: ComponentParam) {
  let counter = 0
  dom.render(`
<div>
  <button id="decrement">Decrement</button>
  <button id="increment">Increment</button>
</div>
<div id="counter">${counter}</div>
`)

  const decrementButton = dom.querySelector('#decrement')!
  const incrementButton = dom.querySelector('#increment')!
  const counterDiv = dom.querySelector('#counter')!

  const events = event.waitEvent(
    event.domEvent('click')
  )
  for await (const ev of events) {
    if (ev.target === incrementButton) {
      counter++
    } else if (ev.target === decrementButton) {
      counter--
    }

    counterDiv.textContent = `${counter}`
  }
}

start(document.getElementById('root')!, main)
```

