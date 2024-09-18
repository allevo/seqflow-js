import { expectAssignable, expectNotAssignable, expectType } from "tsd";
import { type ComponentProps, SeqFlowComponentContext } from "../src/index";
import { combineEventAsyncGenerators, createCustomEventAsyncGenerator, domainEvent, domEvent } from "../src/events";
import { createDomainEventClass, DomainEvent } from "../src/domains";

const component = new SeqFlowComponentContext(
	document.createElement("div"),
	new AbortController(),
	{
		log: console,
	},
);

expectType<JSX.Element>(<button></button>);
expectType<JSX.Element>(<button>nested</button>);
expectType<JSX.Element>(
	<div>
		<button>nested</button>
	</div>,
);
expectType<JSX.Element>(
	<div>
		<button>nested</button>
		<span>S</span>
	</div>,
);
expectType<JSX.Element>(
	<div>
		<button>nested</button>
		<span>S</span>PP
	</div>,
);
expectType<JSX.Element>(<button style={{ backgroundColor: "red" }} />);
expectType<JSX.Element>(<div />);
expectType<JSX.Element>(<div className="pippo" />);
expectType<JSX.Element>(<div className={["pippo"]} />);
expectType<JSX.Element>(<div onClick={() => {}} />);
expectType<JSX.Element>(
	<div
		onClick={(e) => {
			expectType<MouseEvent>(e);
		}}
	/>,
);
expectType<JSX.Element>(<div className="pippo" onClick={() => {}} />);
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

async function MyComponent({
	pippo,
	sfCtx,
}: ComponentProps<{ pippo?: number }>) {
	expectType<number | undefined>(pippo);
	expectType<SeqFlowComponentContext>(sfCtx);
}
expectType<JSX.ElementType>(MyComponent);

expectType<JSX.ElementType>(async ({ children }) => {
	expectType<JSX.Element[]>(children);
});

expectType<JSX.Element>(<></>);
expectType<JSX.Element>(<>A</>);
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

expectType<JSX.Element>(<svg:svg></svg:svg>);
expectType<JSX.Element>(
	<svg:svg>
		<svg:path />
	</svg:svg>,
);

expectType<AsyncGenerator<MouseEvent>>(domEvent(document.body, 'click', {})(new AbortController()));
expectType<AsyncGenerator<SubmitEvent>>(domEvent(document.body, 'submit', {})(new AbortController()));
expectType<AsyncGenerator<Event>>(domEvent(document.body, 'custom-name', {})(new AbortController()));

expectType<AsyncGenerator<MouseEvent>>(combineEventAsyncGenerators(
	new AbortController(),
	domEvent(document.body, 'click', {}),
));
expectNotAssignable<AsyncGenerator<MouseEvent>>(combineEventAsyncGenerators(
	new AbortController(),
	domEvent(document.body, 'submit', {}),
));
expectType<AsyncGenerator<MouseEvent | SubmitEvent>>(combineEventAsyncGenerators(
	new AbortController(),
	domEvent(document.body, 'click', {}),
	domEvent(document.body, 'submit', {}),
));
expectType<AsyncGenerator<Event>>(combineEventAsyncGenerators(
	new AbortController(),
	domEvent(document.body, 'click', {}),
	domEvent(document.body, 'submit', {}),
	domEvent(document.body, 'custom-name', {}),
));

const g = createCustomEventAsyncGenerator<number>();
expectType<Parameters<typeof g.push>[0]>(5);
g.push(5)
expectType<AsyncGenerator<number>>(g(new AbortController()));

declare module "../src/types" {
	interface Domains {
		counter: string;
	}
}


const myEvent = new DomainEvent(undefined)
expectType<DomainEvent<'myDomainName', undefined>>(
	myEvent
)
expectType<DomainEvent<'bar', undefined>>(
	new DomainEvent(undefined)
)
expectAssignable<DomainEvent<'bar', undefined>>(
	// @ts-expect-error
	new DomainEvent('myDomainName', undefined)
)

const MyEvent1 = createDomainEventClass('counter', 'pippo')
type MyEvent1Type = InstanceType<typeof MyEvent1>

const MyEvent2 = createDomainEventClass('counter', 'pippo2')
type MyEvent2Type = InstanceType<typeof MyEvent2>

expectType<MyEvent1Type>(
	new MyEvent1(undefined)
)
expectType<MyEvent2Type>(
	new MyEvent2(undefined)
)
expectAssignable<MyEvent1Type>(
	// @ts-expect-error
	new MyEvent2(undefined)
)

const MyEvent3 = createDomainEventClass<{ bar: string }, 'pippo'>('counter', 'pippo')
const myEvent3 = new MyEvent3({ bar: '' })
// @ts-expect-error
myEvent3.t === 'pa'
// @ts-expect-error
new MyEvent3({ bar: 33 })

domainEvent(new EventTarget(), MyEvent3)
