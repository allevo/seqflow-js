import type { SeqflowFunctionContext } from "seqflow-js";
import { Button } from "seqflow-js-components";
import type { Product } from "../../product";
import classes from "./AddToCart.module.css";

export async function AddToCart(
	this: SeqflowFunctionContext,
	data: { product: Product },
) {
	const initCount = this.app.domains.cart.getProductCount(data.product.id);

	this._el.style.width = "100px";

	this.renderSync(
		<>
			<Button
				className={[classes.firstAddToCart, "w-full"]}
				key="first-add-to-cart"
				type="button"
				color="primary"
			>
				Add to cart
			</Button>
			<div
				key="other-add-to-cart-wrapper"
				className={[classes.otherAddToCartWrapper, classes.show, "w-full"]}
			>
				<Button
					className={classes.removeFromCart}
					key="remove-from-cart"
					type="button"
					color="ghost"
					shape="circle"
				>
					-
				</Button>
				<span key="counter" className="count">
					{initCount}
				</span>
				<Button
					className={classes.secondAddFromCart}
					key="second-add-to-cart"
					type="button"
					color="ghost"
					shape="circle"
				>
					+
				</Button>
			</div>
		</>,
	);

	const firstAddToCart = this.getChild("first-add-to-cart");
	const secondAddToCart = this.getChild("second-add-to-cart");
	const removeFromCart = this.getChild("remove-from-cart");
	const otherAddToCartWrapper = this.getChild("other-add-to-cart-wrapper");
	const counter = this.getChild("counter");

	if (initCount > 0) {
		counter.textContent = `${initCount}`;
		firstAddToCart.classList.remove(classes.show);
		otherAddToCartWrapper.classList.add(classes.show);
	} else {
		counter.textContent = "0";
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
				counter.textContent = `${c}`;
				otherAddToCartWrapper.classList.add(classes.show);
				firstAddToCart.classList.remove(classes.show);
				break;
			}
			case removeFromCart.contains(target): {
				const remain = this.app.domains.cart.removeFromCart({
					product: data.product,
				});
				counter.textContent = `${remain}`;
				if (remain === 0) {
					otherAddToCartWrapper.classList.remove(classes.show);
					firstAddToCart.classList.add(classes.show);
				}
				break;
			}
			case secondAddToCart.contains(target): {
				const c = this.app.domains.cart.addToCart({ product: data.product });
				counter.textContent = `${c}`;
				break;
			}
		}
	}
}
