import { start } from "seqflow-js";
import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, undefined, {
	log: (l) => console.log(l),
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
