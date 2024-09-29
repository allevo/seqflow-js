# SeqFlow JS

SeqFlowJS is a JavaScript library for creating and managing frontend workflows. The core ideas are:
- Events over State Management
- Simplicity over Complexity
- Linearity over Complex Abstractions
- Explicitness over Implicitiveness

See the [documentation](https://seqflow.dev) for more information.

## Installation

```bash
pnpm install seqflow-js
```

## Usage

```tsx
import { SeqflowFunctionContext } from "seqflow-js";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://api.quotable.io/random")
	return await res.json();
}

export async function Main(this: SeqflowFunctionContext) {
	// Render loading message
	this.renderSync(
		<p>Loading...</p>
	);

	// Perform an async operation
	const quote = await getRandomQuote();

	// Replace loading message with quote
	this.renderSync(
		<div>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</div>
	);
}

start(document.getElementById("root"), Main, undefined, {});
```
