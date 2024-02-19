import { ComponentParam } from "seqflow-js";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./CartTooltip.module.css";

export async function CartTooltip({ event, dom, domains }: ComponentParam) {
	dom.render(`
<div class="${classes.wrapper}">
  <a class="${classes.cartTooltipLink}" id="cart-tooltip-link" href="/cart">Go to checkout</a>
</div>`);

	const wrapper = dom.querySelector(`.${classes.wrapper}`);
	const cartTooltipLink = dom.querySelector("#cart-tooltip-link");

	if (domains.cart.getProductCount() !== 0) {
		wrapper.classList.add(classes.show);
	}

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
					wrapper.classList.remove(classes.show);
				}
				if (ev.detail.action === "add" && count === 1) {
					wrapper.classList.add(classes.show);
				}
				break;
			}
			case ev instanceof CheckoutEndedCartEvent: {
				wrapper.classList.remove(classes.show);
				break;
			}
			case ev.type === "click" && ev.target === cartTooltipLink: {
				event.navigate("/cart");
				break;
			}
		}
	}
}
