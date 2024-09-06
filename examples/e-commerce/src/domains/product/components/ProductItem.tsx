import type { SeqflowFunctionContext } from "seqflow-js";
import { Card } from "seqflow-js-components";
import { AddToCart } from "../../cart/components/AddToCart";
import type { Product } from "../ProductDomain";
import classes from "./ProductItem.module.css";

export async function ProductItem(this: SeqflowFunctionContext, data: Product) {
	const tooltip = <div className={classes.tooltipWrapper}>{data.title}</div>;
	this.renderSync(
		<Card compact shadow="xl" className={["h-full", "max-w-xs"]}>
			<figure>
				<img
					className={classes.productImage}
					src={data.image}
					alt={data.title}
				/>
			</figure>
			<Card.Body>
				<Card.Title level={2}>{data.title}</Card.Title>
				{tooltip}
				<Card.Actions>
					<AddToCart product={data} />
				</Card.Actions>
			</Card.Body>
		</Card>,
	);

	const events = this.waitEvents(
		this.domEvent("mouseover", { el: this._el }),
		this.domEvent("mouseout", { el: this._el }),
	);
	for await (const e of events) {
		if (e.type === "mouseover") {
			tooltip.classList.add(classes.show);
		} else {
			tooltip.classList.remove(classes.show);
		}
	}
}
