import { start } from "seqflow-js";
import { Main } from "./Main";
import { CartDomain } from "./domains/cart";
import { ProductDomain } from "./domains/product";
import { UserDomain } from "./domains/user";
import "./index.css";

start(document.getElementById("root"), Main, {
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
	config: {
		api: {
			baseUrl: "https://fakestoreapi.com",
		},
	},
});
