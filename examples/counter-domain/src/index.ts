import { start } from "seqflow-js";
import { CounterDomain } from "./domains/counter";

import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, undefined, {
	log: console,
	domains: {
		counter: (eventTarget) => {
			return new CounterDomain(eventTarget);
		},
	},
});

declare module "seqflow-js" {
	interface Domains {
		counter: CounterDomain;
	}
}
