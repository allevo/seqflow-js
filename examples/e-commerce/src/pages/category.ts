import { ComponentParam } from "seqflow-js";
import { CardList } from "../components/CardList";
import { components } from "../domains/product";

async function Loading({ dom: { render } }: ComponentParam) {
	render("<div>Loading...</div>");
}

export async function Category({
	dom,
	signal,
	domains,
	router,
}: ComponentParam) {
	dom.render(`
<div>
  <div id='loading'></div>
  <div id="banner"></div>
  <div id='products'></div>
</div>`);
	dom.child("loading", Loading);

	const loadingElement = dom.querySelector("#loading");
	console.log(router.segments);
	const categoryId = router.segments.pop();

	const products = await domains.product.fetchProductsByCategory(
		{ categoryId },
		signal,
	);

	loadingElement.remove();

	dom.child("products", CardList, {
		data: {
			prefix: "category",
			items: products,
			component: components.ProductItem,
		},
	});
}
