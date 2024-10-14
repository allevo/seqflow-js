import {
	type ApplicationConfiguration,
	type Domains,
	SeqFlowComponentContext,
	type SeqflowComponent,
} from ".";
import { BrowserRouter, type Router } from "./router";

export interface Log {
	message: string;
	data?: unknown;
}
export type LogFunction = (l: Log) => void;
export interface LogFunctions {
	info: LogFunction;
	error: LogFunction;
	debug: LogFunction;
}

type DomainNames = keyof Domains;

type DomainEventTargets = Record<keyof Domains, EventTarget>;

export class SeqflowAppContext<Domains> {
	constructor(
		public log: LogFunctions,
		public config: Readonly<ApplicationConfiguration>,
		public domains: Readonly<Domains>,
		public router: Readonly<Router>,
		private domainEventTargets: DomainEventTargets,
	) {}

	getDomainEventTarget(domainName: keyof Domains): EventTarget {
		return this.domainEventTargets[domainName as keyof DomainEventTargets];
	}
}

type DomainCreators = {
	[K in keyof Domains]: (
		eventTarget: EventTarget,
		applicationDomainTargets: Readonly<{
			[D in keyof Domains]: EventTarget;
		}>,
		config: Readonly<ApplicationConfiguration>,
	) => Domains[K];
}

export type StartConfiguration<Domains extends object> = Omit<
	Partial<SeqflowAppContext<Domains>>,
	"log" | "domains" | "configuration"
> & {
	log?: Partial<SeqflowAppContext<Domains>["log"]>;
} & (object extends SeqflowAppContext<Domains>["config"] // If the ApplicationConfiguration is empty,
		? // we allow to not pass it
			object
		: // otherwise we require it
			{ config: SeqflowAppContext<Domains>["config"] }) &
	(
		object extends SeqflowAppContext<Domains>["domains"] // If the Domains is empty,
		? // we allow to not pass it
			{ domains?: DomainCreators; }
			: { domains: DomainCreators; }
	);

function applyDefault(
	configuration: StartConfiguration<Domains>,
): SeqflowAppContext<Domains> {
	function noop() {}

	// The default router is BrowserRouter
	if (configuration.router === undefined) {
		configuration.router = new BrowserRouter(new EventTarget());
	}

	// The default log is noop
	if (configuration.log === undefined) {
		configuration.log = {};
	}
	if (configuration.log.info === undefined) {
		configuration.log.info = noop;
	}
	if (configuration.log.error === undefined) {
		configuration.log.error = noop;
	}
	if (configuration.log.debug === undefined) {
		configuration.log.debug = noop;
	}

	if (configuration.config === undefined) {
		configuration.config = {} as Readonly<ApplicationConfiguration>;
	}

	// Build domains...
	// First all event targets
	const domainsFuctions: DomainCreators =
		configuration.domains ?? ({} as DomainCreators);
	const domainNames = Object.keys(
		domainsFuctions,
	) as DomainNames[];
	const domainEventTargets = {} as Record<string, EventTarget>;
	for (const domainName of domainNames) {
		domainEventTargets[domainName] = new EventTarget();
	}
	// Then all domains
	const domains = {} as Domains;
	for (const domainName of domainNames) {
		const domainFunction = domainsFuctions[domainName] as (
			eventTarget: EventTarget,
			applicationDomainTargets: Readonly<{
				[D in keyof Domains]: EventTarget;
			}>,
			config: Readonly<ApplicationConfiguration>,
		) => unknown;
		domains[domainName] = domainFunction(
			domainEventTargets[domainName],
			domainEventTargets as DomainEventTargets,
			configuration.config,
		) as Domains[keyof Domains];
	}

	return new SeqflowAppContext(
		configuration.log as SeqflowAppContext<Domains>["log"],
		configuration.config,
		domains,
		configuration.router,
		domainEventTargets as DomainEventTargets,
	);
}

export function start<
	T extends Record<string, unknown>,
	MainComponent extends SeqflowComponent<T>,
>(
	root: HTMLElement,
	mainComponent: MainComponent,
	data: T,
	configuration: StartConfiguration<Domains>,
): AbortController {
	const appAbortController = new AbortController();

	const appConfiguration = applyDefault(configuration);

	appConfiguration.router.install();

	const comp = new SeqFlowComponentContext(
		root,
		appAbortController,
		appConfiguration,
	);

	root.appendChild(comp.createDOMElement(mainComponent, data));

	return appAbortController;
}
