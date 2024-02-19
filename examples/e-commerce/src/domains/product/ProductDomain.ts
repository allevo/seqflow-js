export class ProductDomain {
	constructor(private _eventTarget: EventTarget) {}

	async fetchProductsCategories(
		signal: AbortSignal,
	): Promise<ProductCategory[]> {
		const res = await fetch("https://fakestoreapi.com/products/categories", {
			signal,
		});
		const categories = (await res.json()) as string[];

		return categories.map((name, id) => {
			const url = `/images/categories/${name}.webp`;
			return { id, name, image: { url } };
		});
	}

	async fetchProductsByCategory(
		{ categoryId }: { categoryId: string },
		signal: AbortSignal,
	): Promise<Product[]> {
		const res = await fetch(
			`https://fakestoreapi.com/products/category/${categoryId}`,
			{ signal },
		);
		return (await res.json()) as Product[];
	}
}

export interface ProductCategory {
	id: number;
	name: string;
	image: {
		url: string;
	};
}

export interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	image: string;
}
