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
		plugins: [sendToDevTools()],
	},
);

function sendToDevTools(): SeqflowPlugin {
	const store = {
		activeElement: new Map<string, KeyPair>(),
	};
	function handleComponentCreated(keyPair: KeyPair) {
		console.log("componentCreated", keyPair);
		store.activeElement.set(keyPair.global, keyPair);
		document.dispatchEvent(
			new CustomEvent("componentCreated", { detail: { keyPair } }),
		);
	}
	function handleComponentRemoved(keyPair: KeyPair) {
		console.log("componentRemoved", keyPair);
		store.activeElement.delete(keyPair.global);
		document.dispatchEvent(
			new CustomEvent("componentRemoved", { detail: { keyPair } }),
		);
	}
	function sendAllToDevTools() {
		console.log("sendAllToDevTools");
		document.dispatchEvent(
			new CustomEvent("allComponents", {
				detail: { keyPairs: Array.from(store.activeElement) },
			}),
		);
	}
	function handleComponentListening(
		parentComponentKeyPair: KeyPair,
		listenOnKeyPair: KeyPair | undefined,
		eventName: string,
	) {
		console.log("handleComponentListening");
		document.dispatchEvent(
			new CustomEvent("componentListening", {
				detail: { parentComponentKeyPair, listenOnKeyPair, eventName },
			}),
		);
	}

	document.addEventListener("pluginTabShown", (event) => {
		console.log("pluginTabShown");
		// sendAllToDevTools();
	});

	return {
		onDomainEventTargetsCreated: () => {
			document.dispatchEvent(
				new CustomEvent("allComponents", {
					detail: { keyPairs: [] },
				}),
			);
		},
		onComponentListening(
			contexts: Contexts,
			componentKeyPair: KeyPair,
			listenOnKeyPair,
			eventName: string,
		) {
			handleComponentListening(componentKeyPair, listenOnKeyPair, eventName);
		},
		onComponentCreated: (
			contexts: Contexts,
			componentKeyPair: KeyPair,
			props: unknown,
		) => {
			if (typeof props !== "object" || props === null || !("key" in props)) {
				return;
			}
			handleComponentCreated(componentKeyPair);
		},
		onComponentEnded: (
			contexts: Contexts,
			componentKeyPair: KeyPair,
			props: unknown,
			result: ComponentResult,
		) => {
			if (typeof props !== "object" || props === null || !("key" in props)) {
				return;
			}
			handleComponentRemoved(componentKeyPair);
		},
	};
}
