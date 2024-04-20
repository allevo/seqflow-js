import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";

import { type Log, type SeqflowFunctionContext, start } from "../src/index";

test("app log", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.app.log({ type: "info", message: "render" });
		this.renderSync("");
	}

	const logs: Log[] = [];
	start(
		document.body,
		App,
		{},
		{
			log: (l: Log) => {
				logs.push(l);
			},
		},
	);
	expect(document.body.innerHTML).toBe("");

	const appLog = logs.find((l) => l.message === "render" && l.type === "info");
	expect(appLog).toBeDefined();
});

test("app config", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.app.log({ type: "info", message: this.app.config.api });
		this.renderSync("");
	}

	const logs: Log[] = [];
	start(
		document.body,
		App,
		{},
		{
			log: (l: Log) => {
				logs.push(l);
			},
			config: {
				api: "https://api.example.com",
			},
		},
	);
	expect(document.body.innerHTML).toBe("");

	const appLog = logs.find(
		(l) => l.message === "https://api.example.com" && l.type === "info",
	);
	expect(appLog).toBeDefined();
});

declare module "../src/index" {
	interface ApplicationConfiguration {
		api: string;
	}
}
