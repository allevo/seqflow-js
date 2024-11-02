import { Alert } from "@seqflow/components";
import { Contexts, NavigationEvent } from "@seqflow/seqflow";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./CartTooltip.module.css";

export async function CartTooltip(_: unknown, { component, app }: Contexts) {
	const hasProduct = app.domains.cart.getProductCount() !== 0;
	const isCart = app.router.segments.includes("cart");

	const c = [classes.wrapper, "cursor-pointer"];
	if (hasProduct && !isCart) {
		c.push(classes.show);
	}
	component._el.classList.add(...c);

	component.renderSync(
		<Alert
			className={[classes.cartTooltipLink]}
			id="cart-tooltip-alert"
			color="info"
			key="cart-tooltip"
		>
			<a id="cart-tooltip-link" href="/cart">
				Go to checkout
			</a>
		</Alert>,
	);

	const events = component.waitEvents(
		component.domainEvent(ChangeCartEvent),
		component.domainEvent(CheckoutEndedCartEvent),
		component.navigationEvent(),
		component.domEvent("cart-tooltip", "click", { preventDefault: true }),
	);
	for await (const ev of events) {
		switch (true) {
			case ev.type === "click" &&
				component._el.contains(ev.target as HTMLElement): {
				app.router.navigate("/cart");
				break;
			}
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: in other page, it depends on the cart state as below
			case ev instanceof NavigationEvent:
				if (ev.path === "/cart") {
					component._el.classList.remove(classes.show);
					break;
				}
			case ev instanceof ChangeCartEvent: {
				const count = app.domains.cart.getProductCount();
				if (count === 0) {
					component._el.classList.remove(classes.show);
				} else if (count > 0) {
					component._el.classList.add(classes.show);
				}
				break;
			}
			case ev instanceof CheckoutEndedCartEvent: {
				component._el.classList.remove(classes.show);
				break;
			}
		}
	}
}
