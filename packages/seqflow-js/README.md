# SeqFlow JS

SeqFlowJS is a JavaScript library for creating and managing frontend workflows. The core ideas are:
- Events over State Management
- Simplicity over Complexity
- Linearity over Complex Abstractions
- Explicitness over Implicitiveness

## Installation

```bash
pnpm install seqflow-js
```

## Usage

```tsx
import { start, SeqflowFunctionContext } from 'seqflow-js'

async function Main(this: SeqflowFunctionContext) {
  let counter = 0

  const decrementButton = <button type="button">Decrement</button>
  const incrementButton = <button type="button">Increment</button>
  const counterDiv = <div>{counter}</div>
  this.renderSync(
    <>
      <div>
        {decrementButton}
        {incrementButton}
      </div>
      {counterDiv}
    </>
  )

  const events = this.waitEvents(
    this.domEvent('click', { el: this._el })
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

start(document.getElementById('root')!, Main)
```

