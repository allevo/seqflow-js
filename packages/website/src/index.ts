import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { start } from "seqflow-js";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, undefined, {
        log: {
                error: (l) => console.error(l),
                info: (l) => console.info(l),
                debug: (l) => console.debug(l),
        },
});
