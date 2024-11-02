import type { DomainEventTargets, KeyPair } from ".";
import type { Contexts } from "./types";

export type ComponentResult =
	| {
			status: "success";
	  }
	| {
			status: "error";
			error?: Error;
	  };

export interface SeqflowPlugin {
	onDomainEventTargetsCreated?: (ets: DomainEventTargets) => void;
	onComponentCreated?: <T>(
		contexts: Contexts,
		componentKeyPair: KeyPair,
		props: T,
	) => void;
	onComponentListening?: (
		contexts: Contexts,
		componentKeyPair: KeyPair,
		listenOnKeyPair: KeyPair | undefined,
		eventName: string,
	) => void;
	onComponentEnded?: <T>(
		contexts: Contexts,
		componentKeyPair: KeyPair,
		props: T,
		result: ComponentResult,
	) => void;
}

export class SeqflowPluginManager {
	private foo: {
		onDomainEventTargetsCreated: NonNullable<
			SeqflowPlugin["onDomainEventTargetsCreated"]
		>[];
		onComponentCreated: NonNullable<SeqflowPlugin["onComponentCreated"]>[];
		onComponentListening: NonNullable<SeqflowPlugin["onComponentListening"]>[];
		onComponentEnded: NonNullable<SeqflowPlugin["onComponentEnded"]>[];
	} = {
		onDomainEventTargetsCreated: [],
		onComponentCreated: [],
		onComponentListening: [],
		onComponentEnded: [],
	};

	constructor(plugins: SeqflowPlugin[]) {
		for (const p of plugins) {
			if (p.onDomainEventTargetsCreated) {
				this.foo.onDomainEventTargetsCreated.push(
					p.onDomainEventTargetsCreated.bind(p),
				);
			}
			if (p.onComponentCreated) {
				this.foo.onComponentCreated.push(p.onComponentCreated.bind(p));
			}
			if (p.onComponentListening) {
				this.foo.onComponentListening.push(p.onComponentListening.bind(p));
			}
			if (p.onComponentEnded) {
				this.foo.onComponentEnded.push(p.onComponentEnded.bind(p));
			}
		}
	}

	onDomainEventTargetsCreated(ets: DomainEventTargets) {
		for (const f of this.foo.onDomainEventTargetsCreated) {
			f(ets);
		}
	}

	onComponentCreated<T>(
		contexts: Contexts,
		componentKeyPair: KeyPair,
		props: T,
	) {
		for (const f of this.foo.onComponentCreated) {
			f(contexts, componentKeyPair, props);
		}
	}

	onComponentEnded<T>(
		contexts: Contexts,
		componentKeyPair: KeyPair,
		props: T,
		result: ComponentResult,
	) {
		for (const f of this.foo.onComponentEnded) {
			f(contexts, componentKeyPair, props, result);
		}
	}

	onComponentListening<T>(
		contexts: Contexts,
		componentKeyPair: KeyPair,
		listenOnKeyPair: KeyPair | undefined,
		eventName: string,
	) {
		for (const f of this.foo.onComponentListening) {
			f(contexts, componentKeyPair, listenOnKeyPair, eventName);
		}
	}
}
