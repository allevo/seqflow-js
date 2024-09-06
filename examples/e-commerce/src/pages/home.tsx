import type { SeqflowFunctionContext } from "seqflow-js";
import { components } from "../domains/product";

async function Loading(this: SeqflowFunctionContext) {
	this.renderSync(<div>Loading...</div>);
}

export async function Home(this: SeqflowFunctionContext) {
	this.renderSync(<Loading />);

	const categories = await this.app.domains.product.fetchProductsCategories(
		this.abortController.signal,
	);

	this.renderSync(<components.ProductCategoryList categories={categories} />);
}
