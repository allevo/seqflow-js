import { start } from "seqflow-js";
import { Main } from "./Main";
import { CartDomain } from "./domains/cart";
import { ProductDomain } from "./domains/product";
import { UserDomain } from "./domains/user";
import "./index.css";

start(document.getElementById("root"), Main, undefined, {
	log(log) {
		console.log(log);
	},
	domains: {
		user: (eventTarget, _, config) => {
			return new UserDomain(eventTarget, config);
		},
		cart: (eventTarget) => {
			return new CartDomain(eventTarget);
		},
		product: (eventTarget, _, config) => {
			return new ProductDomain(eventTarget, config);
		},
	},
	config: {
		api: {
			baseUrl: "https://fakestoreapi.com",
		},
	},
});
