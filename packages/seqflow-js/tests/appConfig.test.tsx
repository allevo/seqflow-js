import { beforeAll, beforeEach, expect, test, vi } from "vitest";

import { type Log, type SeqflowFunctionContext, start } from "../src/index";

const consoleInfoSpy = vi.spyOn(console, "info");

beforeEach(() => {
	vi.clearAllMocks();
});

test("app log", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.app.log.info({ message: "render" });
		this.renderSync("");
	}

	start(
		document.body,
		App,
		{},
		{
			log: {
				error: (l: Log) => console.error(l),
				info: (l: Log) => console.info(l),
				debug: (l: Log) => console.debug(l),
			},
		},
	);
	expect(document.body.innerHTML).toBe("");
	expect(consoleInfoSpy).toHaveBeenCalledOnce();
	expect(consoleInfoSpy).toHaveBeenCalledWith({ message: "render" });
});

test("app log - partial", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.app.log.error({ message: "render" });
		this.app.log.info({ message: "render" });
		this.app.log.debug({ message: "render" });
		this.renderSync("1");
	}

	start(
		document.body,
		App,
		{},
		{
			log: {},
		},
	);
	expect(document.body.innerHTML).toBe("1");
});

test("app config", async () => {
	async function App(this: SeqflowFunctionContext) {
		this.app.log.info({ message: this.app.config.api });
		this.renderSync("");
	}

	start(
		document.body,
		App,
		{},
		{
			log: {
				error: (l: Log) => console.error(l),
				info: (l: Log) => console.info(l),
				debug: (l: Log) => console.debug(l),
			},
			config: {
				api: "https://api.example.com",
			},
		},
	);
	expect(document.body.innerHTML).toBe("");
	expect(consoleInfoSpy).toHaveBeenCalledOnce();
	expect(consoleInfoSpy).toHaveBeenCalledWith({
		message: "https://api.example.com",
	});
});

declare module "../src/index" {
	interface ApplicationConfiguration {
		api: string;
	}
}
