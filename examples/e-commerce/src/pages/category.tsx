import { ComponentProps, Contexts } from "@seqflow/seqflow";
import { CardList } from "../components/CardList";
import { components } from "../domains/product";

async function Loading(_: ComponentProps<unknown>, { component }: Contexts) {
	component.render(<div>Loading...</div>);
}

export async function Category(
	_: ComponentProps<unknown>,
	{ component, app }: Contexts,
) {
	component.render(<Loading />);

	const categoryId = app.router.segments.pop();

	if (!categoryId) {
		app.router.navigate("/");
		return;
	}

	const products = await app.domains.product.fetchProductsByCategory(
		{ categoryId },
		component.ac.signal,
	);

	component.render(
		<CardList
			prefix="category"
			items={products}
			Component={components.ProductItem}
		/>,
	);
}
