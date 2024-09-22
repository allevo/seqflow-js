import type { SeqflowAppContext } from ".";
import type { SeqFlowComponentContext } from "./component";

// biome-ignore lint/suspicious/noEmptyInterface: This type is fulfilled by the user
export interface Domains {}

// biome-ignore lint/suspicious/noEmptyInterface: This type is fulfilled by the user
export interface ApplicationConfiguration {}

export type OverwriteHtmlFor<X extends object> = "htmlFor" extends keyof X
	? {
			[K in keyof Omit<X, "htmlFor">]: X[K];
		} & {
			htmlFor?: string;
		}
	: X;

export type ElementProperty<X extends object> = OverwriteHtmlFor<
	{
		[K in keyof Omit<X, "key" | "className" | "style">]: X[K] extends object
			? never
			: X[K];
	} & {
		key?: string;
		style?: Partial<CSSStyleDeclaration> | string;
		className?: string | string[];
		onClick?: (event: MouseEvent) => void;
	}
>;

export type ComponentProps<X> = X &
	Record<Exclude<string, "children">, unknown> & {
		children?: JSX.Element[];
	};

export type SeqflowComponent<T extends object> =
	// support custom async element
	(
		| ((_: ComponentProps<T>, c: Contexts) => Promise<void>)
		// support custom sync element
		| ((_: ComponentProps<T>, c: Contexts) => void)
	) & {
		// We let the developer to customize the wrapper tag
		tagName?: (props: T) => keyof HTMLElementTagNameMap | (string & {});
	};

export type Contexts = {
	component: SeqFlowComponentContext;
	app: SeqflowAppContext<Domains>;
};
declare global {
	namespace JSX {
		type ElementType =
			// support basic html element
			| string
			// custom component
			// biome-ignore lint/suspicious/noExplicitAny: JSX supports badly generic components
			| SeqflowComponent<any>
			// support fragment (`createDOMFragment`)
			| symbol;

		// this is what `createDOMElement` returns
		type Element = HTMLElement | DocumentFragment | SVGElement | MathMLElement;

		type IntrinsicElements = {
			[K in keyof HTMLElementTagNameMap]: ElementProperty<{
				[KK in keyof Partial<
					HTMLElementTagNameMap[K]
				>]: HTMLElementTagNameMap[K][KK];
			}>;
		} & {
			[K in keyof SVGElementTagNameMap as `svg:${K}`]: {
				[KK in keyof Partial<
					SVGElementTagNameMap[K]
				>]: SVGElementTagNameMap[K][KK];
			};
		} & {
			[K in keyof MathMLElementTagNameMap as `math:${K}`]: {
				[KK in keyof Partial<
					MathMLElementTagNameMap[K]
				>]: MathMLElementTagNameMap[K][KK];
			};
		};

		interface IntrinsicAttributes {
			id?: string;
			key?: string;
		}

		interface ElementAttributesProperty {
			props: unknown;
			_: Contexts;
		}
	}
}
