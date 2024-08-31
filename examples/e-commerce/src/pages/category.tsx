import type { SeqflowFunctionContext } from "seqflow-js";
import { CardList } from "../components/CardList";
import { components } from "../domains/product";

async function Loading(this: SeqflowFunctionContext) {
	this.renderSync(<div>Loading...</div>);
}

export async function Category(this: SeqflowFunctionContext) {
	this.renderSync(<Loading />);

	const categoryId = this.app.router.segments.pop();

	if (!categoryId) {
		this.app.router.navigate("/");
		return;
	}

	const products = await this.app.domains.product.fetchProductsByCategory(
		{ categoryId },
		this.abortController.signal,
	);

	this.renderSync(
		<CardList
			prefix="category"
			items={products}
			Component={components.ProductItem}
		/>,
	);
}
