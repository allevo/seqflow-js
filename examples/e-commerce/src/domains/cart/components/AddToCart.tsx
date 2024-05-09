import { SeqflowFunctionContext } from "seqflow-js";
import { Product } from "../../product/ProductDomain";
import classes from "./AddToCart.module.css";

export async function AddToCart(
	this: SeqflowFunctionContext,
	data: { product: Product },
) {
	const initCount = this.app.domains.cart.getProductCount(data.product.id);

	const firstAddToCart = (
		<button type="button" class={classes.firstAddToCart}>
			Add to cart
		</button>
	);
	const removeFromCart = (
		<button type="button" class={classes.removeFromCart}>
			-
		</button>
	);
	const secondAddFromCart = (
		<button type="button" class={classes.secondAddFromCart}>
			+
		</button>
	);
	const count = <span class="count">{initCount}</span>;
	const otherAddToCartWrapper = (
		<div class={`${classes.otherAddToCartWrapper} ${classes.show}`}>
			{removeFromCart}
			{count}
			{secondAddFromCart}
		</div>
	);
	this.renderSync(
		<div>
			{firstAddToCart}
			{otherAddToCartWrapper}
		</div>,
	);

	if (initCount > 0) {
		count.textContent = `${initCount}`;
		firstAddToCart.classList.remove(classes.show);
		otherAddToCartWrapper.classList.add(classes.show);
	} else {
		count.textContent = "0";
		firstAddToCart.classList.add(classes.show);
		otherAddToCartWrapper.classList.remove(classes.show);
	}

	const events = this.waitEvents(
		this.domEvent("click", {
			el: this._el,
		}),
	);
	for await (const ev of events) {
		const target = ev.target as HTMLElement;
		switch (true) {
			case firstAddToCart.contains(target): {
				const c = this.app.domains.cart.addToCart({ product: data.product });
				count.textContent = `${c}`;
				otherAddToCartWrapper.classList.add(classes.show);
				firstAddToCart.classList.remove(classes.show);
				break;
			}
			case removeFromCart.contains(target): {
				const remain = this.app.domains.cart.removeFromCart({
					product: data.product,
				});
				count.textContent = `${remain}`;
				if (remain === 0) {
					otherAddToCartWrapper.classList.remove(classes.show);
					firstAddToCart.classList.add(classes.show);
				}
				break;
			}
			case secondAddFromCart.contains(target): {
				const c = this.app.domains.cart.addToCart({ product: data.product });
				count.textContent = `${c}`;
				break;
			}
		}
	}
}
