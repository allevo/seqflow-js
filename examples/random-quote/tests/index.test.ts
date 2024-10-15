import { screen } from "@testing-library/dom";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, test } from "vitest";

import { start } from "@seqflow/seqflow";
import { Main } from "../src/Main";
import { QuoteDomain } from "../src/domains/quote";

const quotes = [
	{ content: "quote 1", author: "Author 1" },
	{ content: "quote 2", author: "Author 2" },
];

let index = 0;
const server = setupServer(
	http.get("/random", () => {
		return HttpResponse.json(quotes[index++ % quotes.length]);
	}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should render the quote and refresh it", async () => {
	start(document.body, Main, {}, {
		config: {
			api: {
				// Route to the mock server
				baseUrl: "",
			},
		},
		domains: {
			quotes: (et, _, config) => new QuoteDomain(et, config.api.baseUrl),
		},
	});

	await screen.findByText("Click the button to read a quote");

	const button = await screen.findByRole("button");
	button.click();

	await screen.findByRole("progressbar");

	await screen.findByText(new RegExp(quotes[0].content, "i"));
	await screen.findByText(new RegExp(quotes[0].author, "i"));

	button.click();

	await screen.findByRole("progressbar");

	await screen.findByText(new RegExp(quotes[1].content, "i"));
	await screen.findByText(new RegExp(quotes[1].author, "i"));

	button.click();

	await screen.findByRole("progressbar");

	await screen.findByText(new RegExp(quotes[0].content, "i"));
	await screen.findByText(new RegExp(quotes[0].author, "i"));
});
