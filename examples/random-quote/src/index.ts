import "@seqflow/components/style.css";
import { debugEventTarget, start } from "@seqflow/seqflow";
import { Main } from "./Main";
import "./index.css";

import { QuoteDomain } from "./domains/quote";

start(
	document.getElementById("root")!,
	Main,
	{},
	{
		log: console,
		config: {
			api: {
				baseUrl: "https://api.quotable.io",
			},
		},
		domains: {
			quotes: (et, _, config) =>
				new QuoteDomain(debugEventTarget(et), config.api.baseUrl),
		},
	},
);

declare module "@seqflow/seqflow" {
	interface ApplicationConfiguration {
		api: {
			baseUrl: string;
		};
	}
	interface Domains {
		quotes: QuoteDomain;
	}
}
