import { createDomainEventClass } from "seqflow-js";
import { Product } from "../product/ProductDomain";

export const ChangeCartEvent = createDomainEventClass<{
	product: Product;
	action:
		| "add-product"
		| "remove-element-product"
		| "remove-all-elements-of-a-product";
}>("cart", "change-cart");
export const CheckoutEndedCartEvent = createDomainEventClass(
	"cart",
	"checkout-end",
);
