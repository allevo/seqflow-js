import type { Domains } from "./types";

/**
 * What we want to achieve:
 * - We want to let developer to create `DomainEvent` class in easy way
 * - We want to let developer to create different `DomainEvent` classes
 * - We want to different types for every `DomainEvent`
 * Achieving this with typescript is hard but:
 * - `static` property helps
 * - `string & {}` helps
 * - `EventType extends string, Inner extends string & EventType = EventType` helps a lot
 *
 * We want to create the following developer experience:
 * ```ts
 * const CounterChangedEvent = createDomainEventClass('counter', 'changed')
 * const g = component.waitEvents(
 * 		component.domainEvent(CounterChangedEvent)
 * )
 * for await (const ev of g) {
 *   // ev is well defined & typed by typescript
 * }
 * ```
 *
 * I'm not a typescript guru, but the following functions/types work.
 * There're tests on types, so if you touch it, make sure the test suite is green
 *
 */

export class DomainEvent<
		EventType extends string,
		DetailType,
		Inner extends string & EventType = EventType,
	>
	extends Event
	implements CustomEvent
{
	public detail: DetailType;

	// This `static` property is required because
	// @ts-ignore
	static t: Inner;

	static domainName: keyof Domains;

	constructor(
		d: DetailType,
		// @ts-expect-error
		type: Inner = "",
	) {
		super(type, {
			bubbles: false,
		});
		this.detail = d;
	}

	/* v8 ignore next 3 */
	initCustomEvent(): void {
		throw new Error("Method not implemented.");
	}
}

export type GetDataType<T> = T extends DomainEvent<"", infer R>
	? R
	: "T is not a DomainEvent";
export type GetArrayOf<T> = () => T[];

export function createDomainEventClass<
	DetailType,
	EventType extends string,
	Inner extends string & EventType = EventType,
>(domainName: keyof Domains, type: Inner) {
	class CustomBusinessEvent extends DomainEvent<Inner, DetailType> {
		static domainName = domainName;
		static t: Inner = type;
		t: Inner = type;

		constructor(detail: DetailType, t: Inner = type) {
			super(detail, type);
		}
	}
	return CustomBusinessEvent;
}
