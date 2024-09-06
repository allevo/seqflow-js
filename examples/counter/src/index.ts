import { start } from "seqflow-js";
import "seqflow-js-components/style.css";
import { Main } from "./Main";
import { CounterDomain } from "./domains/counter/Counter";
import "./index.css";

start(document.getElementById("root")!, Main, undefined, {
	log: console,
	domains: {
		counter: (et) => new CounterDomain(et),
	},
});

declare module "seqflow-js" {
	interface Domains {
		counter: CounterDomain;
	}
}
