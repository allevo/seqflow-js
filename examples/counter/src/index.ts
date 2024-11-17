import "@seqflow/components/style.css";
import { start } from "@seqflow/seqflow";
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
