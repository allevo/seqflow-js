import { ComponentParam } from "seqflow-js";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./cart-badge.module.css";

export async function CartBadge({ event, dom, domains }: ComponentParam) {
	const count = domains.cart.getProductCount();
	dom.render(`
<a href="/cart" class="${classes.numberOfProductsInCart}">
	<i class="fa-solid fa-cart-shopping ${classes.icon}"></i>
	<span class="${classes.cartProductCounter}">${count}</span>
</a>`);

	const numberOfProductsInCart = dom.querySelector(
		`.${classes.numberOfProductsInCart} span`,
	);

	const events = event.waitEvent(
		event.domainEvent(ChangeCartEvent),
		event.domainEvent(CheckoutEndedCartEvent),
		event.domEvent("click"),
	);
	for await (const ev of events) {
		if (ev instanceof ChangeCartEvent || ev instanceof CheckoutEndedCartEvent) {
			numberOfProductsInCart.textContent = `${domains.cart.getProductCount()}`;
		} else {
			// click event
			event.navigate("/cart");
		}
	}
}
