import { ComponentParam } from "seqflow-js";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./CartTooltip.module.css";

export async function CartTooltip({
	event,
	dom,
	domains,
	router,
}: ComponentParam) {
	const hasProduct = domains.cart.getProductCount() !== 0;
	dom.render(`
<div class="${classes.wrapper}" style="display: ${
		hasProduct ? "inline" : "none"
	}">
	<a class="${classes.cartTooltipLink}" id="cart-tooltip-link" href="/cart">Go to checkout</a>
</div>`);

	const wrapper = dom.querySelector(`.${classes.wrapper}`);
	const cartTooltipLink = dom.querySelector("#cart-tooltip-link");

	const events = event.waitEvent(
		event.domainEvent(ChangeCartEvent),
		event.domainEvent(CheckoutEndedCartEvent),
		event.domEvent("click"),
	);
	for await (const ev of events) {
		switch (true) {
			case ev instanceof ChangeCartEvent: {
				const count = domains.cart.getProductCount();
				if (count === 0) {
					wrapper.style.display = "none";
				}
				if (ev.detail.action === "add" && count === 1) {
					wrapper.style.display = "inline";
				}
				break;
			}
			case ev instanceof CheckoutEndedCartEvent: {
				wrapper.style.display = "none";
				break;
			}
			case ev.type === "click" && ev.target === cartTooltipLink: {
				router.navigate("/cart");
				break;
			}
		}
	}
}
