import { start } from "seqflow-js";
import "seqflow-js-components/style.css";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, undefined, {
	log: console,
});
