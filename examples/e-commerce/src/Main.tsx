import { ComponentProps, Contexts } from "@seqflow/seqflow";
import type { CartDomain } from "./domains/cart";
import type { ProductDomain } from "./domains/product";
import type { UserDomain } from "./domains/user";
import { Router } from "./router";

export async function Main(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	await app.domains.user.restoreUser();

	component.renderSync(<Router />);
}

declare module "@seqflow/seqflow" {
	interface Domains {
		user: UserDomain;
		cart: CartDomain;
		product: ProductDomain;
	}

	interface ApplicationConfiguration {
		api: {
			baseUrl: string;
		};
	}
}
