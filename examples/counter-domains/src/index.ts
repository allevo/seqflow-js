import { start } from "seqflow-js";
import { CounterDomain } from "./domains/counter";

import { Main } from "./Main";
import "./index.css";

start(document.getElementById("root"), Main, {
	log(k) {
		console.log(k);
	},
	domains: {
		counter: (eventTarget) => {
			return new CounterDomain(eventTarget);
		},
	},
});
