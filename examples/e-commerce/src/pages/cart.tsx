import { SeqflowFunctionContext } from "seqflow-js";
import { components } from "../domains/cart";

export async function Cart(this: SeqflowFunctionContext) {
	const cart = this.app.domains.cart.getCart();
	this.renderSync(<components.CartProductList cart={cart} />);
}
