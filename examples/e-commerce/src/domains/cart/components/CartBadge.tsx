import { Badge, Button } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./cart-badge.module.css";

export async function CartBadge(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const productCount = app.domains.cart.getProductCount();
	const count = productCount === 0 ? "" : productCount;

	component.renderSync(
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

	const counter = component.getChild("counter") as HTMLSpanElement;
	const events = component.waitEvents(
		component.domainEvent(ChangeCartEvent),
		component.domainEvent(CheckoutEndedCartEvent),
		component.domEvent(component._el, "click", {
			preventDefault: true,
		}),
	);
	for await (const ev of events) {
		if (ev instanceof ChangeCartEvent || ev instanceof CheckoutEndedCartEvent) {
			const productCount = app.domains.cart.getProductCount();
			const count = productCount === 0 ? "" : productCount;
			counter.textContent = `${count}`;
		} else {
			// click event
			app.router.navigate("/cart");
		}
	}
}
