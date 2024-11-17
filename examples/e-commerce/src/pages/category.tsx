import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { CardList } from "../components/CardList";
import { components } from "../domains/product";

async function Loading(_: ComponentProps<unknown>, { component }: Contexts) {
	component.renderSync(<div>Loading...</div>);
}

export async function Category(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component.renderSync(<Loading />);

	const categoryId = app.router.segments.pop();

	if (!categoryId) {
		app.router.navigate("/");
		return;
	}

	const products = await app.domains.product.fetchProductsByCategory(
		{ categoryId },
		component.ac.signal,
	);

	component.renderSync(
		<CardList
			prefix="category"
			items={products}
			Component={components.ProductItem}
		/>,
	);
}
