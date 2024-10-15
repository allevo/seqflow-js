import { start } from "@seqflow/seqflow";
import "@seqflow/components/style.css";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root")!, Main, {}, {
	log: console,
});
