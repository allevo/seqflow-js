import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { CounterChanged } from "../Counter";

export async function ShowValue(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component._el.setAttribute("aria-live", "polite");

	component.renderSync(`${app.domains.counter.get()}`);

	const events = component.waitEvents(component.domainEvent(CounterChanged));
	for await (const ev of events) {
		component._el.textContent = `${ev.detail.currentValue}`;
	}
}
