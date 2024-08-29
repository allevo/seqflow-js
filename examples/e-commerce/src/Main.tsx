import type { SeqflowFunctionContext } from "seqflow-js";
import type { CartDomain } from "./domains/cart";
import type { ProductDomain } from "./domains/product";
import type { UserDomain } from "./domains/user";
import { Router } from "./router";

export async function Main(this: SeqflowFunctionContext) {
	await this.app.domains.user.restoreUser();

	this.renderSync(<Router />);
}

declare module "seqflow-js" {
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
