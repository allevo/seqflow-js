import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { components } from "../domains/product";

async function Loading(_: ComponentProps<unknown>, { component }: Contexts) {
	component.render(<div>Loading...</div>);
}

export async function Home(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component.render(<Loading />);

	const categories = await app.domains.product.fetchProductsCategories(
		component.ac.signal,
	);

	component.render(<components.ProductCategoryList categories={categories} />);
}
