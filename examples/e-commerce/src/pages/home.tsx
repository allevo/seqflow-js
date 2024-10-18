import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { components } from "../domains/product";

async function Loading(_: ComponentProps<unknown>, { component }: Contexts) {
	component.renderSync(<div>Loading...</div>);
}

export async function Home(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component.renderSync(<Loading />);

	const categories = await app.domains.product.fetchProductsCategories(
		component.ac.signal,
	);

	component.renderSync(
		<components.ProductCategoryList categories={categories} />,
	);
}
