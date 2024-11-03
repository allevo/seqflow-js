import { expectType } from "tsd";
import {
	type ComponentProps,
	type Contexts,
	type Domains,
	type SeqFlowAppContext,
	SeqFlowComponentContext,
} from "../src/index";
import { createAppForInnerTest } from "../tests/test-utils";

const component = new SeqFlowComponentContext(
	document.createElement("div"),
	new AbortController(),
	createAppForInnerTest([]),
	{ local: "root", global: "root" },
);

// support cutom component
{
	async function MyComponent(
		{ value, another }: ComponentProps<{ value?: number }>,
		{ component, app }: Contexts,
	) {
		// well typed argument
		expectType<number | undefined>(value);
		// unknown argument
		expectType<unknown>(another);
		// The component
		expectType<SeqFlowComponentContext>(component);
		// The app
		expectType<SeqFlowAppContext<Domains>>(app);
	}

	expectType<JSX.ElementType>(MyComponent);

	// Optional argument
	expectType<JSX.Element>(<MyComponent />);
	expectType<JSX.Element>(<MyComponent></MyComponent>);
	expectType<JSX.Element>(<MyComponent value={5} />);
	expectType<JSX.Element>(
		// @ts-expect-error: Type 'string' is not assignable to type 'number'.ts(2322)
		<MyComponent value={"not a number"} />,
	);

	// `id` is always allowed
	expectType<JSX.Element>(<MyComponent id="a" />);
	// @ts-expect-error: Type 'number' is not assignable to type 'string'.ts(2322)
	expectType<JSX.Element>(<MyComponent id={5} />);

	// TODO: this should trigger an error: MyComponent hasn't `children` property.
	// I don't know how to inform the typesystem about it
	expectType<JSX.Element>(<MyComponent>Foo</MyComponent>);

	// TODO: this should trigger an error: MyComponent hasn't `unknown` property.
	// I don't know how to inform the typesystem about it
	expectType<JSX.Element>(<MyComponent unknown={5} />);
}

// `children` property
{
	expectType<JSX.ElementType>(async ({ children }: ComponentProps<unknown>) => {
		expectType<JSX.Element[] | undefined>(children);
	});
}
