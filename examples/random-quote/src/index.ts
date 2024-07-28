import { start } from "seqflow-js";
import "seqflow-js-components/style.css";
import { Main } from "./Main";
import "./index.css";

import { QuoteDomain } from "./domains/quote";

start(document.getElementById("root")!, Main, undefined, {
	log: console,
	config: {
		api: {
			baseUrl: "https://api.quotable.io",
		},
	},
	domains: {
		quotes: (et, _, config) => new QuoteDomain(et, config.api.baseUrl),
	},
});

declare module "seqflow-js" {
	interface ApplicationConfiguration {
		api: {
			baseUrl: string;
		};
	}
	interface Domains {
		quotes: QuoteDomain;
	}
}
