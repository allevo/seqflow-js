import { start, ComponentParam } from "seqflow-js";
import "./index.css";

async function main({ dom, event }: ComponentParam) {
	let counter = 0;
	dom.render(`
<div></div>
<div id="counter-card">
  <div id="actions">
    <button id="decrement">Decrement</button>
    <div></div>
    <button id="increment">Increment</button>
  </div>
  <div id="counter">${counter}</div>
</div>
<div></div>`);

	const incrementButton = dom.querySelector("#increment");
	const decrementButton = dom.querySelector("#decrement");
	const counterDiv = dom.querySelector("#counter");

	const events = event.waitEvent(event.domEvent("click"));
	for await (const ev of events) {
		if (ev.target === incrementButton) {
			counter++;
		} else if (ev.target === decrementButton) {
			counter--;
		}

		counterDiv.textContent = `${counter}`;
	}
}

start(document.getElementById("root"), main);
