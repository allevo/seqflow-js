import { ComponentParam } from "seqflow-js";
import { CardList } from "../../../components/CardList";
import { ProductCategory } from "../ProductDomain";
import classes from "./ProductCategoryList.module.css";

async function CategoryItem({
	dom,
	data,
	event,
	router,
}: ComponentParam<ProductCategory>) {
	dom.render(`
<a class="${classes.categoryAnchor}" href="/category/${data.name}">
	<img class="${classes.categoryImage}" src="${data.image.url}"/>
	<span>${data.name}</span>
</a>`);

	const events = event.waitEvent(event.domEvent("click"));
	for await (const _ of events) {
		router.navigate(`/category/${data.name}`);
	}
}

export async function ProductCategoryList({
	dom,
	data,
}: ComponentParam<{ categories: ProductCategory[] }>) {
	dom.render('<div id="product-category-list"></div>');

	dom.child("product-category-list", CardList, {
		data: {
			prefix: "category",
			items: data.categories,
			component: CategoryItem,
		},
	});
}
