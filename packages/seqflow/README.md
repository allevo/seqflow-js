# SeqFlow JS

SeqFlow is a modern web framework that is designed to be simple and easy to use. It optimizes the development process by providing a simple and easy-to-understand API. It is a good choice for those who want to create web applications without the complexity of other frameworks.

See the [documentation](https://seqflow.dev) for more information.

## Installation

```bash
pnpm install @seqflow/seqflow
```

## Usage

```tsx
import { Contexts } from "seqflow-js";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://quotes.seqflow.dev/api/quotes/random")
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

start(document.getElementById("root"), Main, {}, {});
```

## License

SeqFlow JS is licensed under the MIT License.
