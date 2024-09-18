import type { AppContext, SeqFlowComponentContext } from "./component";

// biome-ignore lint/suspicious/noEmptyInterface: This type is fulfilled by the user
export interface Domains {}

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
	Record<string, any> & {
		children?: JSX.Element[];
	};
export type Contexts = {
	component: SeqFlowComponentContext;
	app: AppContext;
};
declare global {
	namespace JSX {
		type ElementType =
			// support basic html element
			| string
			// support custom async element
			| ((_: ComponentProps<any>, c: Contexts) => Promise<void>)
			// support custom sync element
			| ((_: ComponentProps<any>, c: Contexts) => void)
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
			props: {};
			_: Contexts;
		}
	}
}
