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
                // 	error: (l) => console.error(l),
                // 	info: (l) => console.info(l),
                // 	debug: (l) => console.debug(l),
                // },
                config: {
                        api: {
                                // Route to the mock server
                                baseUrl: "",
                        },
                },
        });

        await screen.findByText(/loading/i);

        await screen.findByText(new RegExp(quotes[0].content, "i"));
        await screen.findByText(new RegExp(quotes[0].author, "i"));

        const button = await screen.findByRole("button");
        button.click();

        await screen.findByText(/loading/i);

        await screen.findByText(new RegExp(quotes[1].content, "i"));
        await screen.findByText(new RegExp(quotes[1].author, "i"));

        button.click();

        await screen.findByText(/loading/i);

        await screen.findByText(new RegExp(quotes[0].content, "i"));
        await screen.findByText(new RegExp(quotes[0].author, "i"));
});
