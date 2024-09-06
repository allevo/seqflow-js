import type { SeqflowFunctionContext } from "seqflow-js";
import { Card } from "seqflow-js-components";
import { CardList } from "../../../components/CardList";
import type { ProductCategory } from "../ProductDomain";
import classes from "./ProductCategoryList.module.css";

async function CategoryItem(
	this: SeqflowFunctionContext,
	data: ProductCategory,
) {
	this.renderSync(
		<a className={classes.categoryAnchor} href={`/category/${data.name}`}>
			<Card compact className={["image-full", classes.card]}>
				<figure>
					<img
						className={classes.categoryImage}
						src={data.image.url}
						alt={data.name}
					/>
				</figure>
				<Card.Body className={classes.body}>
					<Card.Title level={2} className={classes.productName}>
						{data.name}
					</Card.Title>
				</Card.Body>
			</Card>
		</a>,
	);

	const events = this.waitEvents(
		this.domEvent("click", {
			el: this._el,
			preventDefault: true,
		}),
	);
	for await (const ev of events) {
		this.app.router.navigate(`/category/${data.name}`);
	}
}

export async function ProductCategoryList(
	this: SeqflowFunctionContext,
	data: { categories: ProductCategory[] },
) {
	this.renderSync(
		<div className={classes.productList}>
			<CardList
				prefix="category"
				items={data.categories}
				Component={CategoryItem}
			/>
		</div>,
	);
}
