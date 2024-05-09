import { SeqflowAppContext, SeqflowFunctionContext } from "seqflow-js";
import { CardList } from "../../../components/CardList";
import { ProductCategory } from "../ProductDomain";
import classes from "./ProductCategoryList.module.css";

async function CategoryItem(
	this: SeqflowFunctionContext,
	data: ProductCategory,
) {
	const anchor = (
		<a class={classes.categoryAnchor} href={`/category/${data.name}`}>
			<img class={classes.categoryImage} src={data.image.url} alt={data.name} />
			<span>{data.name}</span>
		</a>
	);
	this.renderSync(anchor);

	const events = this.waitEvents(
		this.domEvent("click", {
			el: anchor,
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
		<div class={classes.productList}>
			<CardList
				prefix="category"
				items={data.categories}
				Component={CategoryItem}
			/>
		</div>,
	);
}
