import { expectType } from "tsd";
import { SeqFlowComponentContext } from "../src/index";
import { createAppForInnerTest } from "../tests/test-utils";

const component = new SeqFlowComponentContext(
	document.createElement("div"),
	new AbortController(),
	createAppForInnerTest([]),
);

// support base html elements
{
	expectType<JSX.ElementType>("div");

	expectType<JSX.Element>(<div />);
	expectType<JSX.Element>(<div>nested</div>);
	// nesting div
	expectType<JSX.Element>(
		<div>
			<div>nested</div>
		</div>,
	);
	// nest different tag
	expectType<JSX.Element>(
		<div>
			<span>nested</span>
		</div>,
	);
	// support array
	expectType<JSX.Element>(
		<div>
			<div>nested</div>
			<span>S</span>
		</div>,
	);
}

// support attributes
{
	expectType<JSX.Element>(<button type="button" />);
	expectType<JSX.Element>(<div id="my-id" />);
	expectType<JSX.Element>(<div aria-live="polite" />);
	expectType<JSX.Element>(<div data-region="live" />);

	// @ts-expect-error: Type 'number' is not assignable to type 'string'.ts(2322)
	expectType<JSX.Element>(<div id={5} />);
	// @ts-expect-error: Type '"foo"' is not assignable to type '"button" | "reset" | "submit" | undefined'.ts(2322)
	expectType<JSX.Element>(<button type="foo" />);
}

// style & className
{
	expectType<JSX.Element>(<div style={{ backgroundColor: "red" }} />);
	expectType<JSX.Element>(<div className="pippo" />);
	// support array of strings as className
	expectType<JSX.Element>(<div className={["pippo"]} />);
}

// `onClick` property
{
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
		// @ts-expect-error: Type 'string' is not assignable to type '(event: MouseEvent) => void'.ts(2322)
		<button type="button" onClick={"string is not a function"} />,
	);
}

// fragment
{
	expectType<JSX.ElementType>(component.createDOMFragment);

	expectType<JSX.Element>(<>{"foo"}</>);
	expectType<JSX.Element>(
		<>
			<div />
		</>,
	);
	expectType<JSX.Element>(
		<>
			<div />
			<span />
			<span />
			<span />
			<span />
			<div />
		</>,
	);
	expectType<JSX.Element>(
		<>
			<div />A
		</>,
	);
	expectType<JSX.Element>(
		<>
			<div>B</div>A
		</>,
	);
}

// SVG
{
	expectType<JSX.Element>(<svg:svg />);
	expectType<JSX.Element>(
		<svg:svg>
			<svg:path />
		</svg:svg>,
	);
}
