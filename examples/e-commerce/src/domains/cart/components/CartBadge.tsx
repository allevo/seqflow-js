import { SeqflowFunctionContext } from "seqflow-js";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./cart-badge.module.css";

export async function CartBadge(this: SeqflowFunctionContext) {
	const count = this.app.domains.cart.getProductCount();

	const counter = (
		<span arial-hidden={true} class={classes.cartProductCounter}>
			{count}
		</span>
	);
	this.renderSync(
		<a href="/cart" title="go to cart" class={classes.numberOfProductsInCart}>
			<i class={`fa-solid fa-cart-shopping ${classes.icon}`} />
			{counter}
		</a>,
	);

	const events = this.waitEvents(
		this.domainEvent(ChangeCartEvent),
		this.domainEvent(CheckoutEndedCartEvent),
		this.domEvent("click", {
			el: this._el,
			preventDefault: true,
		}),
	);
	for await (const ev of events) {
		if (ev instanceof ChangeCartEvent || ev instanceof CheckoutEndedCartEvent) {
			counter.textContent = `${this.app.domains.cart.getProductCount()}`;
		} else {
			// click event
			this.app.router.navigate("/cart");
		}
	}
}
