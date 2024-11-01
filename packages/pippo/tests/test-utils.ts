import type { TaskContext } from "vitest";
import {
	type Domains,
	SeqflowAppContext,
	type SeqflowComponent,
	start,
} from "../src";
import { createDomainEventClass } from "../src/domains";
import { type SeqflowPlugin, SeqflowPluginManager } from "../src/plugin";
import { InMemoryRouter } from "../src/router";

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CounterChangedEvent = createDomainEventClass<
	{
		before: number;
		current: number;
	},
	"counter-changed"
>("counter", "counter-changed");
export type CounterChangedEvent = InstanceType<typeof CounterChangedEvent>;
export class CounterDomain {
	private count = 0;

	constructor(private readonly et: EventTarget) {}

	applyDelta(delta: number) {
		const before = this.count;

		this.count += delta;

		this.et.dispatchEvent(
			new CounterChangedEvent({
				before,
				current: this.count,
			}),
		);
	}

	setValue(value: number) {
		const before = this.count;

		this.count = value;

		this.et.dispatchEvent(
			new CounterChangedEvent({
				before,
				current: this.count,
			}),
		);
	}

	getCount() {
		return this.count;
	}
}

declare module "../src/types" {
	interface Domains {
		counter: CounterDomain;
	}

	interface ApplicationConfiguration {
		foo: string;
	}
}

export function startTestApp(
	testContext: TaskContext<any>,
	App: SeqflowComponent<any>,
	appProps: Record<string, unknown> = {},
	plugins: SeqflowPlugin[] = [],
) {
	let i = 0;
	const abortController = start(document.body, App, appProps, {
		domains: {
			counter: (et) => new CounterDomain(et),
		},
		config: {
			foo: "bar",
		},
		plugins,
		idGenerator: () => `${i++}`,
	});
	abortOnTestFinished(testContext, abortController);

	return abortController;
}

function abortOnTestFinished(
	testContext: TaskContext<any>,
	abortController: AbortController,
) {
	testContext.onTestFinished(() => {
		abortController.abort();
	});
}

export function createAppForInnerTest(logs: any[]): SeqflowAppContext<Domains> {
	const counterEventTarget = new EventTarget();
	let i = 0;
	return new SeqflowAppContext<Domains>(
		{
			debug: (...args: any[]) => logs.push(args),
			info: (...args: any[]) => logs.push(args),
			error: (...args: any[]) => logs.push(args),
		},
		{
			foo: "bar",
		},
		{
			counter: new CounterDomain(new EventTarget()),
		},
		new InMemoryRouter(new EventTarget(), "/"),
		{
			counter: counterEventTarget,
		},
		new SeqflowPluginManager([]),
		() => `${i++}`,
	);
}
