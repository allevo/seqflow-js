import { ComponentParam, start } from "seqflow-js";
import { Router } from "./router";
import "./index.css";
import { UserDomain } from "./domains/user";
import { CartDomain } from "./domains/cart";
import { ProductDomain } from "./domains/product";

async function main({ dom, domains }: ComponentParam) {
	await domains.user.restoreUser();

	dom.render(`<div id='router'></div>`);
	dom.child("router", Router);
}

start(document.getElementById("root"), main, {
	log(log) {
		console.log(log);
	},
	domains: {
		user: (eventTarget) => {
			return new UserDomain(eventTarget);
		},
		cart: (eventTarget) => {
			return new CartDomain(eventTarget);
		},
		product: (eventTarget) => {
			return new ProductDomain(eventTarget);
		},
	},
});

declare module "seqflow-js" {
	interface Domains {
		user: UserDomain;
		cart: CartDomain;
		product: ProductDomain;
	}
}
