import { screen, waitFor } from "@testing-library/dom";
import { expect, test } from "vitest";

import {
	InMemoryRouter,
	type SeqflowFunctionContext,
	createDomainEventClass,
	start,
} from "../src/index";

test("router", async () => {
	async function NavigateButton(this: SeqflowFunctionContext) {
		this.renderSync(<button type="button">navigate</button>);

		const events = this.waitEvents(
			this.domEvent("click", {
				el: this._el,
			}),
		);
		for await (const _ of events) {
			this.app.router.navigate("/new");
		}
	}
	async function BackButton(this: SeqflowFunctionContext) {
		this.renderSync(<button type="button">back</button>);

		const events = this.waitEvents(
			this.domEvent("click", {
				el: this._el,
			}),
		);
		for await (const _ of events) {
			this.app.router.back();
		}
	}
	async function App(this: SeqflowFunctionContext) {
		const span = <span>/</span>;
		this.renderSync(
			<>
				<NavigateButton />
				<BackButton />
				{span}
			</>,
		);

		const events = this.waitEvents(this.navigationEvent());
		for await (const ev of events) {
			span.innerHTML = ev.path;
		}
	}

	const router = new InMemoryRouter(new EventTarget(), "/");
	const routerHistory = (router as unknown as { history: { path: string }[] })
		.history;

	start(
		document.body,
		App,
		{},
		{
			router,
		},
	);

	const navigationButton = await screen.findByText(/navigate/i);
	const backButton = await screen.findByText(/back/i);

	navigationButton.click();

	await waitFor(() => expect(routerHistory.length).toBe(2));
	expect(routerHistory[1].path).toBe("/new");
	await waitFor(() => expect(screen.getByText("/new")).toBeTruthy());

	backButton.click();

	await waitFor(() => expect(routerHistory.length).toBe(1));
	expect(routerHistory[0].path).toBe("/");
	await waitFor(() => expect(screen.getByText("/")).toBeTruthy());
});
