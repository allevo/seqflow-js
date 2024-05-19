import { beforeAll, expect, test, vi } from "vitest";

import { type Log, type SeqflowFunctionContext, start } from "../src/index";

const consoleErrorSpy = vi.spyOn(console, "error");
const consoleInfoSpy = vi.spyOn(console, "info");
const consoleDebugSpy = vi.spyOn(console, "debug");

beforeAll(() => {
        vi.clearAllMocks();
});

test("app log", async () => {
        async function App(this: SeqflowFunctionContext) {
                this.app.log.error({ message: "render" });
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
                }
        );
        expect(document.body.innerHTML).toBe("");
        expect(consoleErrorSpy).toHaveBeenCalledOnce();
        expect(consoleErrorSpy).toHaveBeenCalledWith({ message: "render" });
        expect(consoleInfoSpy).not.toHaveBeenCalled();
        expect(consoleDebugSpy).not.toHaveBeenCalled();
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
                }
        );
        expect(document.body.innerHTML).toBe("");
        expect(consoleInfoSpy).toHaveBeenCalledOnce();
        expect(consoleInfoSpy).toHaveBeenCalledWith({
                message: "https://api.example.com",
        });
        expect(consoleErrorSpy).not.toHaveBeenCalledOnce();
        expect(consoleDebugSpy).not.toHaveBeenCalled();
});

declare module "../src/index" {
        interface ApplicationConfiguration {
                api: string;
        }
}
