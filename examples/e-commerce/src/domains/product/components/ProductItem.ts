import { ComponentParam } from "seqflow-js";
import { Product } from "../ProductDomain";
import classes from "./ProductItem.module.css";
import { AddToCart } from "../../cart/components/AddToCart";

export async function ProductItem({
	dom,
	data,
	event,
}: ComponentParam<Product>) {
	dom.render(`
<div class="${classes.wrapper}">
	<img src="${data.image}" class="${classes.productImage}" alt="${data.title}" />
	<p class="${classes.price}">${data.price} €</p>
	<div class="${classes.tooltipWrapper}">${data.title}</div>
	<div id="product-card-cart-${data.id}"></div>
</div>
`);
	dom.child(`product-card-cart-${data.id}`, AddToCart, {
		data: { product: data },
	});

	const img = dom.querySelector(`.${classes.productImage}`);
	const tooltip = dom.querySelector(`.${classes.tooltipWrapper}`);

	const events = event.waitEvent(
		event.domEvent("mouseover"),
		event.domEvent("mouseout"),
	);
	for await (const e of events) {
		if (e.target !== img) {
			continue;
		}

		if (e.type === "mouseover") {
			tooltip.classList.add(classes.show);
		} else {
			tooltip.classList.remove(classes.show);
		}
	}
}
