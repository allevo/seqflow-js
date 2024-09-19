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
export interface LogFunction {
	info: (l: Log) => void;
	error: (l: Log) => void;
	debug: (l: Log) => void;
}

export interface SeqflowAppContext<Domains> {
	log: LogFunction;
	config: ApplicationConfiguration;
	domains: Domains;
	router: Router;
}

export type StartConfiguration<Domains extends object> = Omit<
	Partial<SeqflowAppContext<Domains>>,
	"log" | "domains" | "configuration"
> & {
	log?: Partial<SeqflowAppContext<Domains>["log"]>;
	domains: {
		[K in keyof Domains]: (
			eventTarget: EventTarget,
			applicationDomainTargets: Readonly<{
				[D in keyof Domains]: EventTarget;
			}>,
			config: Readonly<ApplicationConfiguration>,
		) => Domains[K];
	};
} & (object extends SeqflowAppContext<Domains>["config"] // If the ApplicationConfiguration is empty,
		? // we allow to not pass it
			object
		: // otherwise we require it
			{ config: SeqflowAppContext<Domains>["config"] });

function applyDefault<Domains extends object>(
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
		configuration.config = {};
	}

	// Build domains...
	// First all event targets
	const domainsFuctions =
		configuration.domains || ({} as StartConfiguration<Domains>["domains"]);
	const domainNames = Object.keys(
		domainsFuctions,
	) as unknown as (keyof Domains)[];
	const domainEventTargets = {} as Record<keyof Domains, EventTarget>;
	for (const domainName of domainNames) {
		domainEventTargets[domainName] = new EventTarget();
	}
	// Then all domains
	const domains = {} as SeqflowAppContext<Domains>["domains"];
	for (const domainName of domainNames) {
		const domainFunction = domainsFuctions[domainName];
		domains[domainName] = domainFunction(
			domainEventTargets[domainName],
			domainEventTargets,
			configuration.config,
		);
	}

	return {
		log: configuration.log as SeqflowAppContext<Domains>["log"],
		config: configuration.config,
		router: configuration.router,
		domains,
	};
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
