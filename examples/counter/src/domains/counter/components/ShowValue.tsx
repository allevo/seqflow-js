import type { SeqflowFunctionContext } from "seqflow-js";
import { CounterChanged } from "../Counter";

export async function ShowValue(this: SeqflowFunctionContext) {
	this._el.setAttribute("aria-live", "polite");

	this.renderSync(`${this.app.domains.counter.get()}`);

	const events = this.waitEvents(this.domainEvent(CounterChanged));
	for await (const ev of events) {
		this._el.textContent = `${ev.detail.currentValue}`;
	}
}
