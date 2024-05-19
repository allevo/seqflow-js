In this last part of the tutorial, we will cover how to test our SeqFlow application.

## Format of the application

SeqFlow suggests to use `biome` for formatting the code. The configuration file is `biome.json`. The configuration file is already created when the project is created. The configuration file is used to format the code using `biome` formatter. To format the code, run:

```bash
pnpm run biome
```

We discover that the code is not formatted correctly. To fix it, run:

```bash
pnpm run biome:check
```

## Unit testing

SeqFlow suggests to use `@testing-library/dom`.

Because our application involves fetching data from an API, we need to provide a way to mock the API response. We will use `msw` to mock the API requests. Install it by running:

```bash
pnpm i -D msw
```

The codebase contains the file `tests/index.test.ts` which is the test file for the application. Replace its content with the following:

```tsx
import { screen } from "@testing-library/dom";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";

import { start } from "seqflow-js";
import { Main } from "../src/Main";

const quotes = [
        { content: "quote 1", author: "Author 1" },
        { content: "quote 2", author: "Author 2" },
];

let index = 0;
const server = setupServer(
        http.get("/random", () => {
                return HttpResponse.json(quotes[index++ % quotes.length]);
        })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should render the quote and refresh it", async () => {
        start(document.body, Main, undefined, {
                // log: {
                // 	info: (l: Log) => void;
                // 	error: (l: Log) => void;
                // 	debug: (l: Log) => void;
                // }
                config: {
                        api: {
                                // Route to the mock server
                                baseUrl: "",
                        },
                },
        });

        // Wait for the loading text to be displayed
        await screen.findByText(/loading/i);

        // Wait for the quote content and author to be displayed
        await screen.findByText(new RegExp(quotes[0].content, "i"));
        await screen.findByText(new RegExp(quotes[0].author, "i"));

        // Click the button to refresh the quote
        const button = await screen.findByRole("button");
        button.click();

        // Wait for the loading text to be displayed
        await screen.findByText(/loading/i);

        // Wait for the new quote content and author to be displayed
        await screen.findByText(new RegExp(quotes[1].content, "i"));
        await screen.findByText(new RegExp(quotes[1].author, "i"));

        // Click again the button to refresh the quote
        button.click();

        // Wait for the loading text to be displayed
        await screen.findByText(/loading/i);

        // Wait for the new quote content and author to be displayed
        await screen.findByText(new RegExp(quotes[0].content, "i"));
        await screen.findByText(new RegExp(quotes[0].author, "i"));
});
```

The main idea of the above test is to start the application and perform some checks on the rendered content. In this case we expect:

- The loading text to be displayed. In fact, when the `Main` component is mounted, the first thing it does is to fetch a quote from the API. This will trigger the loading text to be displayed.
- When the quote is fetched, we expect the quote content and author to be displayed.
- When the button is clicked, the loading text should be displayed again and then the new quote content and author should be displayed.
- When the button is clicked again, the loading text should be displayed again and then a quote content and author should be displayed.

To run the test, execute:

```bash
pnpm test
```

The test should pass.

## Conclusion

In this tutorial, we have learned how to create a simple application using SeqFlow. We have covered the following topics:

- How to create a new SeqFlow application.
- How to fetch data from an API and manage the state of the application.
- How to create a new component.
- How to configure the application.
- How to test the application.

Any comments or suggestions are really appreciated. Feel free to open an issue on the [GitHub repository](https://github.com/allevo/seqflow-js/issues).

<div class="d-grid gap-2 col-6 mx-auto">
    <a href="/examples" class="btn btn-outline-primary btn-lg">See other examples</a>
</div>
