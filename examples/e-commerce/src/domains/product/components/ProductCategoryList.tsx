import { SeqflowFunctionContext } from "seqflow-js";
import { CardList } from "../../../components/CardList";
import { ProductCategory } from "../ProductDomain";
import classes from "./ProductCategoryList.module.css";

async function CategoryItem(
	this: SeqflowFunctionContext,
	data: ProductCategory,
) {
	this.renderSync(
		<a className={classes.categoryAnchor} href={`/category/${data.name}`}>
			<img
				className={classes.categoryImage}
				src={data.image.url}
				alt={data.name}
			/>
			<span>{data.name}</span>
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
