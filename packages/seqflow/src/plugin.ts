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

export interface SeqFlowPlugin {
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

export class SeqFlowPluginManager {
	private fns: {
		onDomainEventTargetsCreated: NonNullable<
			SeqFlowPlugin["onDomainEventTargetsCreated"]
		>[];
		onComponentCreated: NonNullable<SeqFlowPlugin["onComponentCreated"]>[];
		onComponentListening: NonNullable<SeqFlowPlugin["onComponentListening"]>[];
		onComponentEnded: NonNullable<SeqFlowPlugin["onComponentEnded"]>[];
	} = {
		onDomainEventTargetsCreated: [],
		onComponentCreated: [],
		onComponentListening: [],
		onComponentEnded: [],
	};

	constructor(plugins: SeqFlowPlugin[]) {
		for (const p of plugins) {
			if (p.onDomainEventTargetsCreated) {
				this.fns.onDomainEventTargetsCreated.push(
					p.onDomainEventTargetsCreated.bind(p),
				);
			}
			if (p.onComponentCreated) {
				this.fns.onComponentCreated.push(p.onComponentCreated.bind(p));
			}
			if (p.onComponentListening) {
				this.fns.onComponentListening.push(p.onComponentListening.bind(p));
			}
			if (p.onComponentEnded) {
				this.fns.onComponentEnded.push(p.onComponentEnded.bind(p));
			}
		}
	}

	onDomainEventTargetsCreated(ets: DomainEventTargets) {
		for (const f of this.fns.onDomainEventTargetsCreated) {
			f(ets);
		}
	}

	onComponentCreated<T>(
		contexts: Contexts,
		componentKeyPair: KeyPair,
		props: T,
	) {
		for (const f of this.fns.onComponentCreated) {
			f(contexts, componentKeyPair, props);
		}
	}

	onComponentEnded<T>(
		contexts: Contexts,
		componentKeyPair: KeyPair,
		props: T,
		result: ComponentResult,
	) {
		for (const f of this.fns.onComponentEnded) {
			f(contexts, componentKeyPair, props, result);
		}
	}

	onComponentListening<T>(
		contexts: Contexts,
		componentKeyPair: KeyPair,
		listenOnKeyPair: KeyPair | undefined,
		eventName: string,
	) {
		for (const f of this.fns.onComponentListening) {
			f(contexts, componentKeyPair, listenOnKeyPair, eventName);
		}
	}
}
