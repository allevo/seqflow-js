import { start } from "@seqflow/seqflow";
import { Main } from "./Main";
import "./index.css";
import { Book } from "@seqflow/document-component-lib";

start(
	document.getElementById("root")!,
	Main,
	{},
	{
		log: console,
		domains: {
            book: () => new Book(),
		}
	},
);
