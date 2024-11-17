import { createDomainEventClass } from "@seqflow/seqflow";
import type { Product } from "../product";

export const ChangeCartEvent = createDomainEventClass<
	{
		product: Product;
		action:
			| "add-product"
			| "remove-element-product"
			| "remove-all-elements-of-a-product";
	},
	"change-cart"
>("cart", "change-cart");
export const CheckoutEndedCartEvent = createDomainEventClass(
	"cart",
	"checkout-end",
);
