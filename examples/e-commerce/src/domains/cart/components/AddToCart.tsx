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

	component.renderSync(
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
	const secondAddToCart = component.getChild("second-add-to-cart");
	const removeFromCart = component.getChild("remove-from-cart");
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

	const events = component.waitEvents(
		component.domEvent(component._el, "click"),
	);
	for await (const ev of events) {
		const target = ev.target as HTMLElement;
		switch (true) {
			case firstAddToCart.contains(target): {
				const c = app.domains.cart.addToCart({ product: data.product });
				counter.textContent = `${c}`;
				otherAddToCartWrapper.classList.add(classes.show);
				firstAddToCart.classList.remove(classes.show);
				break;
			}
			case removeFromCart.contains(target): {
				const remain = app.domains.cart.removeFromCart({
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
				const c = app.domains.cart.addToCart({ product: data.product });
				counter.textContent = `${c}`;
				break;
			}
		}
	}
}
