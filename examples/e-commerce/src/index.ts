import "@seqflow/components/style.css";
import { ComponentResult, Contexts, KeyPair, start } from "@seqflow/seqflow";
import { SeqflowPlugin } from "@seqflow/seqflow";
import { Main } from "./Main";
import { CartDomain } from "./domains/cart";
import { ProductDomain } from "./domains/product";
import { UserDomain } from "./domains/user";
import "./index.css";

start(
	document.getElementById("root")!,
	Main,
	{},
	{
		log: console,
		domains: {
			user: (eventTarget, _, config) => {
				return new UserDomain(eventTarget, config);
			},
			cart: (eventTarget) => {
				return new CartDomain(eventTarget);
			},
			product: (eventTarget, _, config) => {
				return new ProductDomain(config);
			},
		},
		config: {
			api: {
				baseUrl: "https://fakestoreapi.com",
			},
		},
	},
);
