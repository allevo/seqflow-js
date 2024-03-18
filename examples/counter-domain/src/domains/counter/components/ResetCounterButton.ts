import { ComponentParam } from "seqflow-js";

export async function ResetCounterButton({
	dom,
	event,
	domains,
}: ComponentParam) {
	dom.render(`<button type="button">Reset</button>`);
	const events = event.waitEvent(event.domEvent("click"));
	for await (const _ of events) {
		domains.counter.reset();
	}
}
