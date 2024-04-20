import { start } from "seqflow-js";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, undefined, {
	log: (l) => console.log(l),
});
