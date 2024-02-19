import { createDomainEventClass } from "seqflow-js";
import { Product } from "../product/ProductDomain";

export const ChangeCartEvent = createDomainEventClass<{
	product: Product;
	action: "add" | "remove" | "remove-all";
}>("cart", "change-cart");
export const CheckoutEndedCartEvent = createDomainEventClass(
	"cart",
	"checkout-end",
);
