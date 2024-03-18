import { ComponentParam } from "seqflow-js";

async function Button({ dom, data }: ComponentParam<{ text: string }>) {
	dom.render(`<button>${data.text}</button>`);
}

export async function Main({ dom, event }: ComponentParam) {
	let counter = 0;
	dom.render(`
<div>
	<div id="decrement"></div>
	<div id="increment"></div>
</div>
<div id="counter">${counter}</div>
`);
	dom.child("decrement", Button, { data: { text: "Decrement" } });
	dom.child("increment", Button, { data: { text: "Increment" } });

	const incrementButton = dom.querySelector("#increment");
	const decrementButton = dom.querySelector("#decrement");
	const counterDiv = dom.querySelector("#counter");

	const events = event.waitEvent(event.domEvent("click"));
	for await (const ev of events) {
		if (incrementButton.contains(ev.target)) {
			counter++;
		} else if (decrementButton.contains(ev.target)) {
			counter--;
		}

		counterDiv.textContent = `${counter}`;
	}
}
