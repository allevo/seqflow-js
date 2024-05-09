import type { Domains } from "./index";

export class DomainEvent<T> extends Event implements CustomEvent<T> {
	static domainName: keyof Domains;
	static t: string;
	detail: T;

	constructor(detail: T, eventType = "") {
		super(eventType, { bubbles: true });
		this.detail = detail;
	}

	/* v8 ignore next 3 */
	initCustomEvent(): void {
		throw new Error("Method not implemented.");
	}
}
export type GetDataType<T> = T extends DomainEvent<infer R>
	? R
	: "T is not a DomainEvent";
export type GetArrayOf<T> = () => T[];

export function createDomainEventClass<T>(
	domainName: keyof Domains,
	type: string,
) {
	class CustomBusinessEvent extends DomainEvent<T> {
		static readonly domainName = domainName;
		static readonly t = type;

		constructor(detail: T) {
			super(detail, type);
		}
	}
	return CustomBusinessEvent;
}
