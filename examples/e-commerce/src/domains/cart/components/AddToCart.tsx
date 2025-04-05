import { Button } from "@seqflow/components";
import type { Contexts } from "@seqflow/seqflow";
import type { Product } from "../../product";
import classes from "./AddToCart.module.css";

export async function AddToCart(
	data: { product: Product },
	{ component, app }: Contexts,
) {
	const initCount = app.domains.cart.getProductCount(data.product.id);

	component._el.style.width = "100px";

	component.render(
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

	const firstAddToCart = component.getChild("first-add-to-cart");
	const otherAddToCartWrapper = component.getChild("other-add-to-cart-wrapper");
	const counter = component.getChild("counter");

	if (initCount > 0) {
		counter.textContent = `${initCount}`;
		firstAddToCart.classList.remove(classes.show);
		otherAddToCartWrapper.classList.add(classes.show);
	} else {
		counter.textContent = "0";
		firstAddToCart.classList.add(classes.show);
		otherAddToCartWrapper.classList.remove(classes.show);
	}

	const events = component.listenEvents(
		component.domEvent(component._el, "click"),
	);
	for await (const ev of events) {
		if (component.matches(ev, "first-add-to-cart", "click")) {
			const c = app.domains.cart.addToCart({ product: data.product });
			counter.textContent = `${c}`;
			otherAddToCartWrapper.classList.add(classes.show);
			firstAddToCart.classList.remove(classes.show);
		} else if (component.matches(ev, "remove-from-cart", "click")) {
			const remain = app.domains.cart.removeFromCart({
				product: data.product,
			});
			counter.textContent = `${remain}`;
			if (remain === 0) {
				otherAddToCartWrapper.classList.remove(classes.show);
				firstAddToCart.classList.add(classes.show);
			}
		} else if (component.matches(ev, "second-add-to-cart", "click")) {
			const c = app.domains.cart.addToCart({ product: data.product });
			counter.textContent = `${c}`;
		}
	}
}
