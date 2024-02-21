import { ComponentParam } from "seqflow-js";
import { CartDomain } from "./domains/cart";
import { ProductDomain } from "./domains/product";
import { UserDomain } from "./domains/user";
import { Router } from "./router";

export async function Main({ dom, domains }: ComponentParam) {
	await domains.user.restoreUser();

	dom.render(`<div id='router'></div>`);
	dom.child("router", Router);
}

declare module "seqflow-js" {
	interface Domains {
		user: UserDomain;
		cart: CartDomain;
		product: ProductDomain;
	}

	interface ApplicationConfig {
		api: {
			baseUrl: string;
		};
	}
}
