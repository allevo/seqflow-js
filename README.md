# SeqFlow JS

This framework is a lightweight, domain-driven front-end framework designed to simplify web application development, reduce complexity, and enhance user experience with an event-driven architecture.

See the [documentation](https://seqflow.dev) for more information.

## Installation

```bash
pnpm install @seqflow/seqflow
```

## Usage

```tsx
import { Contexts } from "@seqflow/seqflow";

interface Quote {
	author: string;
	content: string;
}

async function getRandomQuote(): Promise<Quote> {
	const res = await fetch("https://quotes.seqflow.dev/api/quotes/random")
	return await res.json();
}

export async function Main({}, { component }: Contexts) {
	// Render loading message
	component.renderSync(
		<p>Loading...</p>
	);

	// Perform an async operation
	const quote = await getRandomQuote();

	// Replace loading message with quote
	component.renderSync(
		<div>
			<div>{quote.content}</div>
			<div>{quote.author}</div>
		</div>
	);
}

start(document.getElementById("root"), Main, {}, {});
```

## License

SeqFlow JS is licensed under the [MIT License](LICENSE).
