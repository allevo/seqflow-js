import "@seqflow/components/style.css";
import { start } from "@seqflow/seqflow";
import { Main } from "./Main";
import "./index.css";

start(
	document.getElementById("root")!,
	Main,
	{},
	{
		// log: console,
	},
);
