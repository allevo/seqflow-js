import type { SeqflowFunctionContext } from "seqflow-js";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./cart-badge.module.css";

export async function CartBadge(this: SeqflowFunctionContext) {
	const count = this.app.domains.cart.getProductCount();

	this.renderSync(
		<a
			href="/cart"
			title="go to cart"
			className={classes.numberOfProductsInCart}
		>
			<i className={`fa-solid fa-cart-shopping ${classes.icon}`} />
			<span
				key="counter"
				arial-hidden={true}
				className={classes.cartProductCounter}
			>
				{count}
			</span>
		</a>,
	);

	const counter = this.getChild("counter") as HTMLSpanElement;
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
