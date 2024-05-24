import { SeqflowFunctionContext } from "seqflow-js";
import { AddToCart } from "../../cart/components/AddToCart";
import { Product } from "../ProductDomain";
import classes from "./ProductItem.module.css";

export async function ProductItem(this: SeqflowFunctionContext, data: Product) {
	const tooltip = <div className={classes.tooltipWrapper}>{data.title}</div>;
	this.renderSync(
		<div className={classes.wrapper}>
			<img
				key="product-image"
				src={data.image}
				className={classes.productImage}
				alt={data.title}
			/>
			<p className={classes.price}>{data.price} €</p>
			{tooltip}
			<div id={`product-card-cart-${data.id}`}>
				<AddToCart product={data} />
			</div>
		</div>,
	);

	const productImage = this.getChild("product-image") as HTMLImageElement;
	const events = this.waitEvents(
		this.domEvent("mouseover", { el: this._el }),
		this.domEvent("mouseout", { el: this._el }),
	);
	for await (const e of events) {
		if (!productImage.contains(e.target as HTMLElement)) {
			continue;
		}

		if (e.type === "mouseover") {
			tooltip.classList.add(classes.show);
		} else {
			tooltip.classList.remove(classes.show);
		}
	}
}
