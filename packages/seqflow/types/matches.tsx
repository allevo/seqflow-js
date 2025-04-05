import { expectType } from "tsd";
import {
	NavigationEvent,
	SeqFlowComponentContext,
	createDomainEventClass,
} from "../src/index";
import { createAppForInnerTest } from "../tests/test-utils";

const component = new SeqFlowComponentContext(
	document.createElement("div"),
	new AbortController(),
	createAppForInnerTest([]),
	{ local: "root", global: "root" },
);

// support domain event
{
	const ValueChangedEvent = createDomainEventClass<
		{ value: number },
		"value-changed"
	>("counter", "value-changed");
	const ev = new ValueChangedEvent({ value: 5 });

	if (component.matches(ev, ValueChangedEvent)) {
		expectType<InstanceType<typeof ValueChangedEvent>>(ev);
		const detail = ev.detail;
		expectType<{ value: number }>(detail);
		expectType<number>(detail.value);
	}
}

// support navigation event
{
	const ev = new NavigationEvent("/");
	if (component.matches(ev, NavigationEvent)) {
		expectType<InstanceType<typeof NavigationEvent>>(ev);
		expectType<string>(ev.path);
	}
}
