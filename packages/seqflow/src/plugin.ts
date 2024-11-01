import type { DomainEventTargets } from ".";
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
	onComponentCreated?: <T>(contexts: Contexts, props: T) => void;
	onComponentEnded?: <T>(
		contexts: Contexts,
		props: T,
		result: ComponentResult,
	) => void;
}

export class SeqflowPluginManager {
	private plugins: SeqflowPlugin[] = [];

	constructor(plugins: SeqflowPlugin[]) {
		this.plugins.push(...plugins);
	}

	onDomainEventTargetsCreated(ets: DomainEventTargets) {
		for (const p of this.plugins) {
			if (p.onDomainEventTargetsCreated) {
				p.onDomainEventTargetsCreated(ets);
			}
		}
	}

	onComponentCreated<T>(contexts: Contexts, props: T) {
		for (const p of this.plugins) {
			if (p.onComponentCreated) {
				p.onComponentCreated(contexts, props);
			}
		}
	}

	onComponentEnded<T>(contexts: Contexts, props: T, result: ComponentResult) {
		for (const p of this.plugins) {
			if (p.onComponentEnded) {
				p.onComponentEnded(contexts, props, result);
			}
		}
	}
}
