import type { SeqflowFunctionContext } from "seqflow-js";
import { components } from "../domains/cart";

export async function Cart(this: SeqflowFunctionContext) {
	const cart = this.app.domains.cart.getCart();
	this._el.classList.add("w-3/5");
	this.renderSync(<components.CartProductList cart={cart} />);
}
