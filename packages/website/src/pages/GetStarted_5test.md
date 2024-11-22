In this last part of the tutorial, we will cover how to test our SeqFlow application.

With the word "test", we could mean different things. In this tutorial, we will cover format and linsting, and unit testing.

## Format of the application

SeqFlow suggests using `biome` for formatting the code. The configuration file is `biome.json`. The configuration file is already created when the project is created. To format the code, run:

```bash
pnpm run biome
```

We discovered that the code is not formatted correctly. To fix it, run:

```bash
pnpm run biome:check
```

## Unit testing

In this tutorial, we use the following libraries for testing:
- `@testing-library/dom` for testing the DOM (already installed).
- `msw` for mocking the API requests.

Install `msw` by running:

```bash
pnpm i -D msw
```

The codebase contains the file `tests/index.test.ts` which is the test file for the application.

The following test code will:
- configure the mock server to return a quote.
- start the application with the right configuration.
- check if the quote is displayed.
- click the refresh button.
- check if the *new* quote is displayed.
- click the refresh button.
- check if the *first* quote is displayed.

Replace its content with the following:

```tsx
import { screen } from "@testing-library/dom";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, test } from "vitest";

import { start } from "@seqflow/seqflow";
import { Main } from "../src/Main";

const quotes = [
	{ content: "quote 1", author: "Author 1" },
	{ content: "quote 2", author: "Author 2" },
];

let index = 0;
const server = setupServer(
	http.get("/api/quotes/random", () => {
		return HttpResponse.json(quotes[index++ % quotes.length]);
	}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should render the quote and refresh it", async () => {
	start(
		document.body,
		Main,
		{},
		{
			// log: console,
			config: {
				api: {
					// Route to the mock server
					baseUrl: "",
				},
			},
		},
	);

	// When landed, the user should see the first quote
	await screen.findByText(new RegExp(quotes[0].content, "i"));
	await screen.findByText(new RegExp(quotes[0].author, "i"));

	// When the user clicks the refresh button, the quote should change
	const button = await screen.findByText("Refresh")
	button.click();

	// And the second quote should be displayed
	await screen.findByText(new RegExp(quotes[1].content, "i"));
	await screen.findByText(new RegExp(quotes[1].author, "i"));

	// When the user clicks the refresh button,
	button.click();

	// the first quote should be displayed again
	await screen.findByText(new RegExp(quotes[0].content, "i"));
	await screen.findByText(new RegExp(quotes[0].author, "i"));
});
```

The main idea of the above test is to start the application and perform some checks on the rendered content. In this case, we expect:

- The loading text to be displayed. In fact, when the `Main` component is mounted, it first fetches a quote from the API. This will trigger the loading text to be displayed.
- When the quote is fetched, we expect the content and author to be displayed.
- When the button is clicked, the loading text should be displayed again, and then the new quote content and author should be displayed.
- When the button is clicked, the loading text should be displayed again, and then a quote content and author should be displayed.

To run the test, execute:

```bash
pnpm test
```

The test should pass.

Broadly speaking, you can run the whole application inside a test environment and interact with it as if it were a real browser. This is possible because SeqFlow consumes less memory and CPU than other frameworks. You should? Probably not. But it's good to know that you can.

## Conclusion

This tutorial taught us how to create a simple application using SeqFlow. We have covered the following topics:

- How to create a new SeqFlow application.
- How to fetch data from an API and manage the state of the application.
- How to create a new component.
- How to configure the application.
- How to test the application.
- Split the application into domains [In progress](https://github.com/allevo/seqflow-js/issues/9).

Any comments or suggestions are really appreciated. Feel free to open an issue on the [GitHub repository](https://github.com/allevo/seqflow-js/issues).

:::next:::
{"label": "See other examples", "next": "/examples"}
:::end-next:::
