import { expectType } from "tsd";
import type { Contexts, LogFunction, SeqFlowComponent } from "../src/index";
import type { CounterDomain } from "../tests/test-utils";

const _: SeqFlowComponent<object> = async (_, contexts: Contexts) => {
	// config
	expectType<{ foo: string }>(contexts.app.config);
	expectType<Readonly<{ foo: string }>>(contexts.app.config);

	// logs
	expectType<LogFunction>(contexts.app.log.debug);
	expectType<LogFunction>(contexts.app.log.info);
	expectType<LogFunction>(contexts.app.log.error);

	// domains
	expectType<CounterDomain>(contexts.app.domains.counter);
	// @ts-expect-error: Property 'domain1' does not exist on type 'Readonly<Domains>'.ts(2339)
	expectType<{ foo: string }>(contexts.app.domains.domain1);

	// router
	expectType<string[]>(contexts.app.router.segments);
	expectType<string>(contexts.app.router.getCurrentPathname());

	// domainEventTargets
	expectType<EventTarget>(contexts.app.getDomainEventTarget("counter"));
	// @ts-expect-error: Type '"unknown-domain"' is not assignable to type '"counter"'.ts(2322)
	expectType<EventTarget>(contexts.app.getDomainEventTarget("unknown-domain"));
};
