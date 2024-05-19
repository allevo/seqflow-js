import { start } from "seqflow-js";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, undefined, {
        log: {
                error: (l) => console.error(l),
                info: (l) => console.info(l),
                debug: (l) => console.debug(l),
        },
        config: {
                api: {
                        baseUrl: "https://api.quotable.io",
                },
        },
});

declare module "seqflow-js" {
        interface ApplicationConfiguration {
                api: {
                        baseUrl: string;
                };
        }
}
