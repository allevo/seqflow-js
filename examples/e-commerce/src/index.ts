import "@seqflow/components/style.css";
import { Contexts, start } from "@seqflow/seqflow";
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
		plugins: [sendToDevTools()],
	},
);

function sendToDevTools(): SeqflowPlugin {
	type ComponentKey = string & { __componentKey: never };
	const store = {
		activeElement: new Set<ComponentKey>(),
	};
	function handleComponentCreated(key: ComponentKey) {
		console.log("componentCreated", key);
		store.activeElement.add(key);
		document.dispatchEvent(
			new CustomEvent("componentCreated", { detail: { key } }),
		);
	}
	function handleComponentRemoved(key: ComponentKey) {
		console.log("componentRemoved", key);
		store.activeElement.delete(key);
		document.dispatchEvent(
			new CustomEvent("componentRemoved", { detail: { key } }),
		);
	}
	function sendAllToDevTools() {
		console.log("sendAllToDevTools");
		document.dispatchEvent(
			new CustomEvent("allComponents", {
				detail: { keys: Array.from(store.activeElement) },
			}),
		);
	}

	document.addEventListener("pluginTabShown", (event) => {
		console.log("pluginTabShown");
		sendAllToDevTools();
	});

	return {
		onDomainEventTargetsCreated: (ets) => {
			sendAllToDevTools();
		},
		onComponentCreated: (contexts: Contexts, props: unknown) => {
			if (typeof props !== "object" || props === null || !("key" in props)) {
				return;
			}
			handleComponentCreated(props.key as ComponentKey);
		},
		onComponentEnded: (contexts: Contexts, props: unknown, result) => {
			if (typeof props !== "object" || props === null || !("key" in props)) {
				return;
			}
			handleComponentRemoved(props.key as ComponentKey);
		},
	};
}
