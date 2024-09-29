import { expectType } from "tsd";
import { createDomainEventClass } from "../src/domains";
import {
	type EventAsyncGenerator,
	combineEventAsyncGenerators,
	createCustomEventAsyncGenerator,
	domEvent,
	domainEvent,
	navigationEvent,
} from "../src/events";
import type { NavigationEvent } from "../src/router";

// domEvent
{
	testEventAsyncGeneratorProduce<MouseEvent>(() =>
		domEvent(document.body, "click", {}),
	);
	testEventAsyncGeneratorProduce<SubmitEvent>(() =>
		domEvent(document.body, "submit", {}),
	);
	testEventAsyncGeneratorProduce<Event>(() =>
		domEvent(document.body, "custom-event-name", {}),
	);

	testEventAsyncGeneratorProduce<SubmitEvent>(() =>
		// @ts-expect-error: Unknown event is possible, but Event cannot be treated as SubmitEvent
		domEvent(document.body, "custom-event-name", {}),
	);

	testEventAsyncGeneratorProduce<number>(() =>
		// @ts-expect-error: number is not an Event!!
		domEvent(document.body, "custom-event-name", {}),
	);
}

// custom event async generator
{
	const g = createCustomEventAsyncGenerator<number>();
	// you can push only numbers
	g.push(5);
	// @ts-expect-error: Argument of type 'string' is not assignable to parameter of type 'number'.ts(2345)
	g.push("not a number");

	testEventAsyncGeneratorProduce<number>(() => g);

	// @ts-expect-error: Type 'number' is not assignable to type 'string'.ts(2322)
	testEventAsyncGeneratorProduce<string>(() => g);
}

// domain event - createDomainEventClass
{
	const ValueChangedEvent = createDomainEventClass("counter", "value-changed");

	// always true
	ValueChangedEvent.domainName === "counter";
	// `domainName` is well typed
	// @ts-expect-error: This comparison appears to be unintentional because the types '"counter"' and '""' have no overlap.ts(2367)
	ValueChangedEvent.domainName === "";

	ValueChangedEvent.t === "value-changed";
	// `t` is well typed
	// @ts-expect-error: This comparison appears to be unintentional because the types '"value-changed"' and '""' have no overlap.ts(2367)
	ValueChangedEvent.t === "";

	// @ts-expect-error: `unknown-domain` is not a listed domain name
	createDomainEventClass("unknown-domain", "value-changed");
}

// domain event - new MyDomainEvent(...)
{
	const ValueChangedEvent = createDomainEventClass<
		{ newValue: number },
		"value-changed"
	>("counter", "value-changed");
	type ValueChangedEventType = InstanceType<typeof ValueChangedEvent>;

	// always true
	ValueChangedEvent.domainName === "counter";
	// `domainName` is well typed
	// @ts-expect-error: This comparison appears to be unintentional because the types '"counter"' and '""' have no overlap.ts(2367)
	ValueChangedEvent.domainName === "";

	ValueChangedEvent.t === "value-changed";
	// `t` is well typed
	// @ts-expect-error: This comparison appears to be unintentional because the types '"value-changed"' and '""' have no overlap.ts(2367)
	ValueChangedEvent.t === "";

	// @ts-expect-error: `unknown-domain` is not a listed domain name
	createDomainEventClass("unknown-domain", "value-changed");

	expectType<ValueChangedEventType>(new ValueChangedEvent({ newValue: 5 }));

	// The optional second argument is forced to be exactly the event type name value
	expectType<ValueChangedEventType>(
		new ValueChangedEvent({ newValue: 5 }, "value-changed"),
	);
	// @ts-expect-error: Argument of type '"another-value"' is not assignable to parameter of type '"value-changed"'.ts(2345)
	new ValueChangedEvent({ newValue: 5 }, "another-value");

	// @ts-expect-error: `newValue` is required
	new ValueChangedEvent({});
	// @ts-expect-error
	new ValueChangedEvent({ newValue: "this is not a valid number" });

	// NB: the second parameter is different
	const AnotherCounterEvent = createDomainEventClass<
		{ newValue: number },
		"another-counter-event"
	>("counter", "another-counter-event");
	// @ts-expect-error:   Type '"another-counter-event"' is not assignable to type '"value-changed"'.ts(2322)
	const valueChangedEvent: ValueChangedEventType = new AnotherCounterEvent({
		newValue: 5,
	});
}

// domEvent
{
	const ValueChangedEvent = createDomainEventClass<
		{ newValue: number },
		"value-changed"
	>("counter", "value-changed");
	type ValueChangedEventType = InstanceType<typeof ValueChangedEvent>;

	testEventAsyncGeneratorProduce<ValueChangedEventType>(() =>
		domainEvent(new EventTarget(), ValueChangedEvent),
	);
	// Downcast is possible
	testEventAsyncGeneratorProduce<Event>(() =>
		domainEvent(new EventTarget(), ValueChangedEvent),
	);
	testEventAsyncGeneratorProduce<MouseEvent>(() =>
		// @ts-expect-error: NavigationEvent != MouseEvent
		domainEvent(new EventTarget(), ValueChangedEvent),
	);
}

// navigateEvent
{
	testEventAsyncGeneratorProduce<NavigationEvent>(() =>
		navigationEvent(new EventTarget()),
	);
	// Downcast is possible
	testEventAsyncGeneratorProduce<Event>(() =>
		navigationEvent(new EventTarget()),
	);
	testEventAsyncGeneratorProduce<MouseEvent>(() =>
		// @ts-expect-error: NavigationEvent !== MouseEvent
		navigationEvent(new EventTarget()),
	);
}

// combineEventAsyncGenerators
{
	const g1 = combineEventAsyncGenerators(
		new AbortController(),
		domEvent(document.body, "click", {}),
	);
	expectType<AsyncGenerator<MouseEvent>>(g1);
	testAsyncGeneratorProduce<MouseEvent>(() => g1);
	// Downcast
	testAsyncGeneratorProduce<Event>(() => g1);
	// @ts-expect-error: MouseEvent !== SubmitEvent
	testAsyncGeneratorProduce<SubmitEvent>(() => g1);

	const g2 = combineEventAsyncGenerators(
		new AbortController(),
		domEvent(document.body, "click", {}),
		domEvent(document.body, "submit", {}),
	);
	expectType<AsyncGenerator<MouseEvent | SubmitEvent>>(g2);
	testAsyncGeneratorProduce<MouseEvent | SubmitEvent>(() => g2);
	// Downcast
	testAsyncGeneratorProduce<Event>(() => g2);

	const g3 = combineEventAsyncGenerators(
		new AbortController(),
		domEvent(document.body, "click", {}),
		navigationEvent(new EventTarget()),
	);
	expectType<AsyncGenerator<MouseEvent | NavigationEvent>>(g3);
	testAsyncGeneratorProduce<MouseEvent | NavigationEvent>(() => g3);
	// Partial downcast
	testAsyncGeneratorProduce<UIEvent | NavigationEvent>(() => g3);
	// Downcast
	testAsyncGeneratorProduce<Event>(() => g3);

	const ValueChangedEvent = createDomainEventClass<
		{ newValue: number },
		"value-changed"
	>("counter", "value-changed");
	type ValueChangedEventType = InstanceType<typeof ValueChangedEvent>;
	const g4 = combineEventAsyncGenerators(
		new AbortController(),
		domEvent(document.body, "click", {}),
		navigationEvent(new EventTarget()),
		domainEvent(new EventTarget(), ValueChangedEvent),
	);
	expectType<
		AsyncGenerator<MouseEvent | NavigationEvent | ValueChangedEventType>
	>(g4);
	testAsyncGeneratorProduce<
		MouseEvent | NavigationEvent | ValueChangedEventType
	>(() => g4);
	// Partial downcast
	testAsyncGeneratorProduce<UIEvent | NavigationEvent | ValueChangedEventType>(
		() => g4,
	);
	// Downcast
	testAsyncGeneratorProduce<Event>(() => g4);
}

async function testEventAsyncGeneratorProduce<T>(
	gen: () => EventAsyncGenerator<T>,
) {
	const eventAsyncGenerator = gen();
	expectType<EventAsyncGenerator<T>>(eventAsyncGenerator);
	const asyncGenerator = eventAsyncGenerator(new AbortController());
	testAsyncGeneratorProduce<T>(() => asyncGenerator);
}

async function testAsyncGeneratorProduce<T>(
	eventAsyncGenerator: () => AsyncGenerator<T>,
) {
	const asyncGenerator = eventAsyncGenerator();
	expectType<AsyncGenerator<T>>(asyncGenerator);

	const nextValue = await asyncGenerator.next();
	expectType<IteratorResult<T>>(nextValue);
	// This is is required because it lets TS know which discriminator `nextVallue` has
	if (nextValue.done) {
		throw new Error();
	}
	const event = nextValue.value;
	expectType<T>(event);

	// Commonly, it is used in this form
	for await (const event of asyncGenerator) {
		expectType<T>(event);
	}
}
