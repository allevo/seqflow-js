import type { SeqflowFunctionContext } from "seqflow-js";
import { Badge, Button } from "seqflow-js-components";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./cart-badge.module.css";

export async function CartBadge(this: SeqflowFunctionContext) {
	const productCount = this.app.domains.cart.getProductCount();
	const count = productCount === 0 ? "" : productCount;

	this.renderSync(
		<Button
			color="ghost"
			shape="circle"
			key="button"
			className={classes.numberOfProductsInCart}
		>
			<i
				className={`fa-solid fa-cart-shopping ${classes.icon}`}
				title="Go to cart"
			/>
			<Badge
				className={classes.cartProductCounter}
				arial-hidden={true}
				color="primary"
				key="counter"
			>{`${count}`}</Badge>
		</Button>,
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
			const productCount = this.app.domains.cart.getProductCount();
			const count = productCount === 0 ? "" : productCount;
			counter.textContent = `${count}`;
		} else {
			// click event
			this.app.router.navigate("/cart");
		}
	}
}
