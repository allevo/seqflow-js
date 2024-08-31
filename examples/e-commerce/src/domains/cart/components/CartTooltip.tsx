import { NavigationEvent, type SeqflowFunctionContext } from "seqflow-js";
import { Alert } from "seqflow-js-components";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./CartTooltip.module.css";

export async function CartTooltip(this: SeqflowFunctionContext) {
	const hasProduct = this.app.domains.cart.getProductCount() !== 0;
	const isCart = this.app.router.segments.includes("cart");

	const c = [classes.wrapper, "cursor-pointer"];
	if (hasProduct && !isCart) {
		c.push(classes.show);
	}
	this._el.classList.add(...c);

	this.renderSync(
		<Alert
			className={[classes.cartTooltipLink]}
			id="cart-tooltip-alert"
			color="info"
		>
			<a id="cart-tooltip-link" href="/cart">
				Go to checkout
			</a>
		</Alert>,
	);

	const events = this.waitEvents(
		this.domainEvent(ChangeCartEvent),
		this.domainEvent(CheckoutEndedCartEvent),
		this.navigationEvent(),
		this.domEvent("click", { el: this._el, preventDefault: true }),
	);
	for await (const ev of events) {
		switch (true) {
			case ev.type === "click" && this._el.contains(ev.target as HTMLElement): {
				this.app.router.navigate("/cart");
				break;
			}
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: in other page, it depends on the cart state as below
			case ev instanceof NavigationEvent:
				if (ev.path === "/cart") {
					this._el.classList.remove(classes.show);
					break;
				}
			case ev instanceof ChangeCartEvent: {
				const count = this.app.domains.cart.getProductCount();
				if (count === 0) {
					this._el.classList.remove(classes.show);
				} else if (count > 0) {
					this._el.classList.add(classes.show);
				}
				break;
			}
			case ev instanceof CheckoutEndedCartEvent: {
				this._el.classList.remove(classes.show);
				break;
			}
		}
	}
}
