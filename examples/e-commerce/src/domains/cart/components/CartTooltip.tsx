import { NavigationEvent, SeqflowFunctionContext } from "seqflow-js";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import classes from "./CartTooltip.module.css";

export async function CartTooltip(this: SeqflowFunctionContext) {
	const hasProduct = this.app.domains.cart.getProductCount() !== 0;
	this._el.classList.add(classes.wrapper);
	if (!hasProduct) {
		this._el.style.display = "none";
	} else {
		this._el.style.display = "inline";
	}

	const cartTooltipLink = (
		<a className={classes.cartTooltipLink} id="cart-tooltip-link" href="/cart">
			Go to checkout
		</a>
	);
	this.renderSync(cartTooltipLink);

	const events = this.waitEvents(
		this.domainEvent(ChangeCartEvent),
		this.domainEvent(CheckoutEndedCartEvent),
		this.navigationEvent(),
		this.domEvent("click", { el: this._el, preventDefault: true }),
	);
	for await (const ev of events) {
		switch (true) {
			case ev.type === "click" &&
				cartTooltipLink.contains(ev.target as HTMLElement): {
				this.app.router.navigate("/cart");
				break;
			}
			case ev instanceof NavigationEvent: {
				if (ev.path === "/cart") {
					this._el.style.display = "none";
				} else {
					this._el.style.display = "inline";
				}
				break;
			}
			case ev instanceof ChangeCartEvent: {
				const count = this.app.domains.cart.getProductCount();
				if (count === 0) {
					this._el.style.display = "none";
				}
				if (count > 0) {
					this._el.style.display = "inline";
				}
				break;
			}
			case ev instanceof CheckoutEndedCartEvent: {
				this._el.style.display = "none";
				break;
			}
		}
	}
}
