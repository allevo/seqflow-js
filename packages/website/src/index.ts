import { start } from "@seqflow/seqflow";
import { Main } from "./Main";
import '@seqflow/components/style.css'
import "./index.css";

start(document.getElementById("root")!, Main, {}, {
	// log: console,
});
