import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { components } from "../domains/cart";

export async function Cart(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	const cart = app.domains.cart.getCart();
	component._el.classList.add("w-3/5");
	component.renderSync(<components.CartProductList cart={cart} />);
}
