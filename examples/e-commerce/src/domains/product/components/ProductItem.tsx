import { Card } from "@seqflow/components";
import { Contexts } from "@seqflow/seqflow";
import { AddToCart } from "../../cart/components/AddToCart";
import type { Product } from "../ProductDomain";
import classes from "./ProductItem.module.css";

export async function ProductItem(data: Product, { component }: Contexts) {
	const tooltip = (
		<div className={classes.tooltipWrapper}>{data.title}</div>
	) as HTMLDivElement;
	component.renderSync(
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

	const events = component.waitEvents(
		component.domEvent(component._el, "mouseover"),
		component.domEvent(component._el, "mouseout"),
	);
	for await (const e of events) {
		if (e.type === "mouseover") {
			tooltip.classList.add(classes.show);
		} else {
			tooltip.classList.remove(classes.show);
		}
	}
}
