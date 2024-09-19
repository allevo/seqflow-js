import { expectAssignable, expectNotAssignable, expectType } from "tsd";
import { DomainEvent, createDomainEventClass } from "../src/domains";
import {
	combineEventAsyncGenerators,
	createCustomEventAsyncGenerator,
	domEvent,
	domainEvent,
} from "../src/events";
import {
	type AppContext,
	type ComponentProps,
	type Contexts,
	SeqFlowComponentContext,
} from "../src/index";

const component = new SeqFlowComponentContext(
	document.createElement("div"),
	new AbortController(),
	{
		log: console,
	},
);

expectType<JSX.Element>(<button type="button" />);
expectType<JSX.Element>(<button type="button">nested</button>);
expectType<JSX.Element>(
	<div>
		<button type="button">nested</button>
	</div>,
);
expectType<JSX.Element>(
	<div>
		<button type="button">nested</button>
		<span>S</span>
	</div>,
);
expectType<JSX.Element>(
	<div>
		<button type="button">nested</button>
		<span>S</span>PP
	</div>,
);
expectType<JSX.Element>(
	<button type="button" style={{ backgroundColor: "red" }} />,
);
expectType<JSX.Element>(<div />);
expectType<JSX.Element>(<div className="pippo" />);
expectType<JSX.Element>(<div className={["pippo"]} />);
expectType<JSX.Element>(<button type="button" onClick={() => {}} />);
expectType<JSX.Element>(
	<button
		type="button"
		onClick={(e) => {
			expectType<MouseEvent>(e);
		}}
	/>,
);
expectType<JSX.Element>(
	<button type="button" className="pippo" onClick={() => {}} />,
);
expectType<JSX.Element>(<div id="pippo" />);

expectType<JSX.Element>(<MyComponent />);
expectType<JSX.Element>(<MyComponent>A</MyComponent>);
expectType<JSX.Element>(<MyComponent id="a">A</MyComponent>);
expectType<JSX.Element>(
	<MyComponent id="a" pippo={5}>
		A
	</MyComponent>,
);
expectNotAssignable<Parameters<typeof MyComponent>[0]>({ foo: 5 });
expectAssignable<Parameters<typeof MyComponent>[0]>({ pippo: 5 });

async function MyComponent(
	{ pippo }: ComponentProps<{ pippo?: number }>,
	{ component, app }: Contexts,
) {
	expectType<number | undefined>(pippo);
	expectType<SeqFlowComponentContext>(component);
	expectType<AppContext>(app);
}
expectType<JSX.ElementType>(MyComponent);

expectType<JSX.ElementType>(async ({ children }) => {
	expectType<JSX.Element[]>(children);
});

// biome-ignore lint/complexity/noUselessFragments: test
expectType<JSX.Element>(<></>);
// biome-ignore lint/complexity/noUselessFragments: test
expectType<JSX.Element>(<>{"A"}</>);
expectType<JSX.Element>(
	<>
		<div>A</div>
	</>,
);
expectType<JSX.Element>(
	<>
		<div>A</div>B
	</>,
);
expectType<JSX.Element>(
	<>
		<div>A</div>
		<div>B</div>C
	</>,
);

expectType<JSX.Element>(<svg:svg />);
expectType<JSX.Element>(
	<svg:svg role="img" aria-label="foo">
		<svg:path />
	</svg:svg>,
);

expectType<AsyncGenerator<MouseEvent>>(
	domEvent(document.body, "click", {})(new AbortController()),
);
expectType<AsyncGenerator<SubmitEvent>>(
	domEvent(document.body, "submit", {})(new AbortController()),
);
expectType<AsyncGenerator<Event>>(
	domEvent(document.body, "custom-name", {})(new AbortController()),
);

expectType<AsyncGenerator<MouseEvent>>(
	combineEventAsyncGenerators(
		new AbortController(),
		domEvent(document.body, "click", {}),
	),
);
expectNotAssignable<AsyncGenerator<MouseEvent>>(
	combineEventAsyncGenerators(
		new AbortController(),
		domEvent(document.body, "submit", {}),
	),
);
expectType<AsyncGenerator<MouseEvent | SubmitEvent>>(
	combineEventAsyncGenerators(
		new AbortController(),
		domEvent(document.body, "click", {}),
		domEvent(document.body, "submit", {}),
	),
);
expectType<AsyncGenerator<Event>>(
	combineEventAsyncGenerators(
		new AbortController(),
		domEvent(document.body, "click", {}),
		domEvent(document.body, "submit", {}),
		domEvent(document.body, "custom-name", {}),
	),
);

const g = createCustomEventAsyncGenerator<number>();
expectType<Parameters<typeof g.push>[0]>(5);
g.push(5);
expectType<AsyncGenerator<number>>(g(new AbortController()));

declare module "../src/types" {
	interface Domains {
		counter: string;
	}
}

const myEvent = new DomainEvent(undefined);
expectType<DomainEvent<"myDomainName", undefined>>(myEvent);
expectType<DomainEvent<"bar", undefined>>(new DomainEvent(undefined));
expectAssignable<DomainEvent<"bar", undefined>>(
	// @ts-expect-error
	new DomainEvent("myDomainName", undefined),
);

const MyEvent1 = createDomainEventClass("counter", "pippo");
type MyEvent1Type = InstanceType<typeof MyEvent1>;

const MyEvent2 = createDomainEventClass("counter", "pippo2");
type MyEvent2Type = InstanceType<typeof MyEvent2>;

expectType<MyEvent1Type>(new MyEvent1(undefined));
expectType<MyEvent2Type>(new MyEvent2(undefined));
expectAssignable<MyEvent1Type>(
	// @ts-expect-error
	new MyEvent2(undefined),
);

{
	const CounterChanged = createDomainEventClass<
		{ newValue: number },
		"changed"
	>("counter", "changed");
	new CounterChanged({ newValue: 42 });
	// @ts-expect-error: `t` is always `counter`. So the following comparison is always false
	myEvent.t === "pa";
	// @ts-expect-error: bad `newValue` type
	new CounterChanged({ newValue: "string is not a valid number" });
	// @ts-expect-error: missing `newValue`
	new CounterChanged({});
	// @ts-expect-error: unknown property
	new CounterChanged({ newValue: 42, unknown: 42 });

	domainEvent(new EventTarget(), CounterChanged);
}
