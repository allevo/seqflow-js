import { start } from "@seqflow/seqflow";
import "seqflow-js-components/style.css";
import { Main } from "./Main";
import { CounterDomain } from "./domains/counter/Counter";
import "./index.css";

start(
	document.getElementById("root")!,
	Main,
	{},
	{
		log: console,
		domains: {
			counter: (et) => new CounterDomain(et),
		},
	},
);

declare module "@seqflow/seqflow" {
	interface Domains {
		counter: CounterDomain;
	}
}
