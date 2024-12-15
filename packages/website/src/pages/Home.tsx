import { Divider, Heading, Hero, Link, Prose, Tabs } from "@seqflow/components";
import type { ComponentProps, Contexts } from "@seqflow/seqflow";
import * as Prism from "prismjs";
import { ArrowSVG } from "../components/Arrow";
import classes from "./Home.module.css";
import { title } from "process";

export async function Home(
	_: ComponentProps<unknown>,
	{ component }: Contexts,
) {
	const script = createScript(
		`
${setupArrow.toString()}
${setupArrow.name}();
	`.trim(),
	);

	const liveExampleLinks = [
		{
			id: 'counter',
			title: 'Live example - Counter',
			href: 'https://stackblitz.com/edit/seqflow-counter?file=src%2Findex.tsx',
			bottom: '5px',
		},
		{
			id: 'fetch-random-quote',
			title: 'Live example - Fetch Random Quote',
			href: 'https://stackblitz.com/edit/seqflow-fetch-random-quote?file=src%2Findex.tsx',
			bottom: '5px',
		},
		{
			id: 'async-component',
			title: 'Live example - Async client components',
			href: 'https://stackblitz.com/edit/seqflow-async-component?file=src%2Findex.tsx',
			bottom: '13px',
		},
		{
			id: 'event-stream',
			title: 'Live example - Event as event stream',
			href: 'https://stackblitz.com/edit/seqflow-event-stream?file=src%2Findex.tsx',
			bottom: '13px',
		},
		{
			id: 'state',
			title: 'Live example - Javascript variable as state',
			href: 'https://stackblitz.com/edit/seqflow-state?file=src%2Findex.tsx',
			bottom: '13px',
		},
		{
			id: 'update-ui',
			title: 'Live example - Explicit updates',
			href: 'https://stackblitz.com/edit/seqflow-update-ui?file=src%2Findex.tsx',
			bottom: '13px',
		}
	]
	const addStackBlitzLinksScriptContent = liveExampleLinks.map(({ id, title, href, bottom }, i) => {
		return `
		const code${i} = document.getElementById('${id}');
		code${i}.innerHTML += '<a target="_blank" href="${href}" title="${title}" style="position: absolute; bottom: ${bottom}; right: 5px; z-index: 99; background: #060606; padding: 5px; border-radius: 15px;">See live example</a>';
		`
	}).join('\n');
	const addStackBlitzLinksScript = createScript(addStackBlitzLinksScriptContent);

	component.renderSync([
		<div id="first-screen">
			<SeqFlowHero />
		</div>,
		<div id="second-screen" className={classes.screen}>
			<Features />
			<GetStarted />
		</div>,
		<div
			id="third-screen"
			className={classes.screen}
			style={{ backgroundColor: "rgb(6, 6, 6)" }}
		>
			<div className="text-center p-6 rounded-lg shadow-md">
				<p className="text-2xl font-semibold">
					<em>"Talk is cheap. Show me the code."</em>
					<br />
					<span className="text-right text-sm" style={{ float: "right" }}>
						Linus Torvalds
					</span>
				</p>
			</div>
			<Examples />
			<GetStarted />
		</div>,
		<div className={classes["arrow-wrapper"]}>
			<ArrowSVG />
		</div>,
		<div
			className="arrow-anchor"
			style={{ position: "absolute", top: "0%", opacity: "0" }}
		/>,
		<div
			className="arrow-anchor"
			style={{ position: "absolute", top: "33%", opacity: "0" }}
		/>,
		<div
			className="arrow-anchor"
			style={{ position: "absolute", top: "50%", opacity: "0" }}
		/>,
		script,
		addStackBlitzLinksScript,
	]);

	Prism.highlightAll();

	await new Promise((resolve) => setTimeout(resolve, 100));
	const codeToolbars = component._el.querySelectorAll(
		"#second-screen .code-toolbar",
	);
	for (const toolbar of codeToolbars) {
		toolbar.classList.add(classes["code-toolbar"]);
	}
}

function Examples(_: ComponentProps<unknown>, { component }: Contexts) {
	component.renderSync(
		<Tabs tabFullWidth>
			<Tabs.TabHeader label="Counter" defaultChecked />
			<Tabs.TabContent>
				<Code id="counter" code={EXAMPLES_COUNTER_CODE} />
			</Tabs.TabContent>
			<Tabs.TabHeader label="Fetch Random Quote" />
			<Tabs.TabContent>
				<Code id="fetch-random-quote" code={EXAMPLES_RANDOM_QUOTE_CODE} />
			</Tabs.TabContent>
		</Tabs>,
	);
}

function SeqFlowHero(_: ComponentProps<unknown>, { component }: Contexts) {
	component.renderSync(
		<Hero style={{ backgroundColor: "#060606" }}>
			<Hero.Content
				style={{ minHeight: "max(calc(100vh - 64px), 400px)" }}
				className={"text-center"}
			>
				<div className={"max-w-5xl"}>
					<p className="text-2xl">SeqFlowJS</p>
					<Divider />
					<Heading level={1} className="text-5xl font-bold">
						Simplicity is <em>the</em> key
					</Heading>
					<Divider />
					<GetStarted />
				</div>
			</Hero.Content>
		</Hero>,
	);
}

function GetStarted(_: ComponentProps<unknown>, { component, app }: Contexts) {
	component.renderSync(
		<Link href="/get-started" showAsButton="primary">
			Get started
		</Link>,
	);
}

function Features(_: ComponentProps<unknown>, { component }: Contexts) {
	component._el.classList.add(classes.features);

	const features = [
		{
			title: "Async client components",
			content: () => (
				<>
					<Prose className={classes.prose}>
						<Heading className={"text-center"} level={2}>
							Async client components
						</Heading>
						<div className={"text-center"}>
							<p>SeqFlow Component are asynchronous functions.</p>
							<p>
								Your component can handle async operations in a clear way, just
								using <code>await</code> operator.
							</p>
						</div>
					</Prose>
					<Code id="async-component" code={ASYNC_CLIENT_COMPONENT_CODE} />
				</>
			),
		},
		{
			title: "Event as event stream",
			content: () => (
				<>
					<Prose className={classes.prose}>
						<Heading className={"text-center"} level={2}>
							Event as event stream
						</Heading>
						<div className={"text-center"}>
							<p>
								SeqFlow component uses modern Javascript statements like{" "}
								<code>for await</code> to handle events
							</p>
						</div>
					</Prose>
					<Code id="event-stream" code={EVENT_AS_STREAM_CODE} />
				</>
			),
		},
		{
			title: "Javascript variable as state",
			content: () => (
				<>
					<Prose className={classes.prose}>
						<Heading className={"text-center"} level={2}>
							Javascript variable as state
						</Heading>
						<div className={"text-center"}>
							<p>
								SeqFlow uses simple Javascript variable to store component data.
							</p>
							<p>
								You can use number, string, array, object or class instances, as
								simple as it should be.
							</p>
						</div>
					</Prose>
					<Code id="state" code={STATE_CODE} />
				</>
			),
		},
		{
			title: "Explicit updates",
			content: () => (
				<>
					<Prose className={classes.prose}>
						<Heading className={"text-center"} level={2}>
							Explicit updates
						</Heading>
						<div className={"text-center"}>
							<p>
								SeqFlow component can re-render the whole component or just
								perform a partial update
							</p>
							<p>You can name a child to refer to it later</p>
						</div>
					</Prose>
					<Code id="update-ui" code={UPDATE_UI_CODE} />
				</>
			),
		},
	];

	const featuresComponent = features.flatMap(({ title, content }, i) => [
		<label
			style={{
				gridArea: `grid-${i + 1}`,
			}}
		>
			<input type="radio" name="features" checked={i === 0} />
			<span className={classes.title}>{title}</span>
			<span className={classes.number}>{i + 1}</span>
		</label>,
		<div className={classes.content}>{content()}</div>,
	]);

	const script = createScript(
		`
		${handleFeatureOver.toString()}
		${handleFeatureOver.name}();
			`.trim(),
	);

	component.renderSync([...featuresComponent, script]);
}

function createScript(code: string) {
	const script = document.createElement("script");
	script.textContent = code;
	script.dataset.keep = "true";

	return script;
}

function handleFeatureOver() {
	const radios = document.querySelectorAll(
		'label:has(input[type="radio"][name="features"])',
	);

	function onOver(ev: MouseEvent) {
		const target = ev.target as HTMLElement;

		const radio = target.querySelector('input[type="radio"]') as
			| HTMLInputElement
			| undefined;
		if (!radio) {
			return;
		}
		radio.checked = true;
	}

	for (const radio of radios) {
		// @ts-expect-error
		radio.addEventListener("mouseenter", onOver);
	}
}

function Code(
	{ code, id }: ComponentProps<{ code: string, id?: string }>,
	{ component }: Contexts,
) {
	component._el.classList.add("language-tsx", "!text-xs", classes.code);
	component.renderSync(<code id={id} className="language-tsx">{code}</code>);
}
Code.tagName = () => "pre";

function setupArrow() {
	const el = document.querySelector("#chevron-down") as HTMLElement | undefined;

	if (!el) {
		console.error("Element not found");
		return;
	}

	if (
		"IntersectionObserver" in window &&
		"IntersectionObserverEntry" in window &&
		"intersectionRatio" in window.IntersectionObserverEntry.prototype
	) {
		const map = new Map<Element, boolean>();
		const anchors = document.querySelectorAll(".arrow-anchor");

		const observer = new IntersectionObserver((entries) => {
			for (const { target } of entries) {
				map.set(target, entries[0].isIntersecting);
			}

			const isVisible = Array.from(map.values()).some((v) => v);
			if (isVisible) {
				el.style.display = "flex";
			} else {
				el.style.display = "none";
			}
		});

		for (const anchor of anchors) {
			map.set(anchor, false);
			observer.observe(anchor);
		}
	}

	const secondSection = document.querySelector("#second-screen");
	const thirdSection = document.querySelector("#third-screen");
	el.addEventListener("click", () => {
		let element: Element | null;
		if ((secondSection?.getClientRects()[0].top || 0) <= 64) {
			element = thirdSection;
		} else {
			element = secondSection;
		}
		element?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	});
}

const ASYNC_CLIENT_COMPONENT_CODE = `
import { Contexts, ComponentProps, start } from '@seqflow/seqflow';

// component properties
interface MyComponentProps {
  loadingText?: string;
}

// A simple component function
export async function MyComponent(
  // component properties
  { loadingText }: ComponentProps<MyComponentProps>,
  // component context
  { component }: Contexts
) {
  // Render loader
  component.renderSync(<div>{loadingText ?? 'Loading...'}</div>);
  const data = await fetch('https://quotes.seqflow.dev/api/quotes/random').then(
    async (res) => ({
      statusCode: res.status,
      body: await res.json(),
    })
  );

  // Redraw the whole component
  component.renderSync(
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

start(document.getElementById('root')!, MyComponent, {}, {});

`.trim();

const EVENT_AS_STREAM_CODE = `
import { Contexts, ComponentProps, start } from '@seqflow/seqflow';

async function MyComponent(
  {}: ComponentProps<unknown>,
  { component }: Contexts
) {
  component.renderSync(
    <button key="my-button" type="button">
      Click me
    </button>
  );

  // create AsyncGenerator
  const events = component.waitEvents(component.domEvent('my-button', 'click'));
  // Wait for events
  for await (const ev of events) {
    window.alert('Button clicked: ' + ev.type);
  }
}

start(document.getElementById('root')!, MyComponent, {}, {});
`.trim();

const STATE_CODE = `
import { Contexts, ComponentProps, start } from '@seqflow/seqflow';

async function MyComponent(
  {}: ComponentProps<unknown>,
  { component }: Contexts
) {
  // The state is a simple Javascript variable
  let counter = 0;

  component.renderSync(
    <button key="my-button" type="button">
      Click me
    </button>
  );

  const events = component.waitEvents(component.domEvent('my-button', 'click'));
  for await (const ev of events) {
    // Update the counter
    counter++;
    window.alert('Number of click:' + counter);
  }
}

start(document.getElementById('root')!, MyComponent, {}, {});
`.trim();

const UPDATE_UI_CODE = `
import { Contexts, ComponentProps, start } from '@seqflow/seqflow';

async function MyComponent(
  {}: ComponentProps<unknown>,
  { component }: Contexts
) {
  component.renderSync(
    <>
      <button key="my-button" type="button">
        Now
      </button>
      <div key="counter">{new Date().toISOString()}</div>
    </>
  );

  const events = component.waitEvents(component.domEvent('my-button', 'click'));
  for await (const ev of events) {
    // Replace the counter div element
    component.replaceChild('counter', () => (
      <div key="counter">{new Date().toISOString()}</div>
    ));
  }
}

start(document.getElementById('root')!, MyComponent, {}, {});
`.trim();

const EXAMPLES_COUNTER_CODE = `
// Imports
import { Contexts, ComponentProps, start } from '@seqflow/seqflow';
import { Button } from '@seqflow/components';
import '@seqflow/components/style.css';

interface CounterProps {
  initialValue?: number;
}

// Counter component function
async function Counter(
  // component properties
  { initialValue }: ComponentProps<CounterProps>,
  // component context
  { component }: Contexts
) {
  let counter = initialValue || 0;

  // Render
  component.renderSync(
    <>
      <Button key="increment-counter-button">Increment</Button>
      <div key="counter">{counter}</div>
    </>
  );

  // create AsyncGenerator
  const events = component.waitEvents(
    // listen "click" event on element tagged by the 'increment-counter-button' key
    component.domEvent('increment-counter-button', 'click')
  );

  // Wait for events
  for await (const _ of events) {
    counter++;
    // Replace a child by key
    component.replaceChild('counter', () => <div key="counter">{counter}</div>);
  }
}

start(document.getElementById('root')!, Counter, {}, {});

`.trim();

const EXAMPLES_RANDOM_QUOTE_CODE = `
// Imports
import { Contexts, ComponentProps, start } from '@seqflow/seqflow';
import { Loading } from '@seqflow/components';
import '@seqflow/components/style.css';

// Quote interface
interface Quote {
  author: string;
  content: string;
}
// Pure function to fetch a random quote
async function getRandomQuote(): Promise<Quote> {
  const res = await fetch('https://quotes.seqflow.dev/api/quotes/random');
  if (!res.ok) {
    throw new Error('Failed to fetch quote');
  }
  return await res.json();
}
// RandomQuote component function
export async function RandomQuote(
  // component properties
  {}: ComponentProps<unknown>,
  // component context
  { component }: Contexts
) {
  // Render
  component.renderSync(<Loading />);

  // Async invocation inside the component
  let quote: Quote;
  try {
    quote = await getRandomQuote();
  } catch (error) {
    component.renderSync(<div>Error: {(error as Error).message}</div>);
    return;
  }

  component.renderSync(
    <blockquote>
      <p>{quote.content}</p>
      <footer>{quote.author}</footer>
    </blockquote>
  );
}

start(document.getElementById('root')!, RandomQuote, {}, {});
`.trim();
