import { Card } from "@seqflow/components";
import type { Contexts } from "@seqflow/seqflow";
import { CardList } from "../../../components/CardList";
import type { ProductCategory } from "../ProductDomain";
import classes from "./ProductCategoryList.module.css";

async function CategoryItem(
	data: ProductCategory,
	{ component, app }: Contexts,
) {
	component.renderSync(
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

	const events = component.waitEvents(
		component.domEvent(component._el, "click", {
			preventDefault: true,
		}),
	);
	for await (const ev of events) {
		app.router.navigate(`/category/${data.name}`);
	}
}

export async function ProductCategoryList(
	data: { categories: ProductCategory[] },
	{ component }: Contexts,
) {
	component.renderSync(
		<div className={classes.productList}>
			<CardList
				prefix="category"
				items={data.categories}
				Component={CategoryItem}
			/>
		</div>,
	);
}
