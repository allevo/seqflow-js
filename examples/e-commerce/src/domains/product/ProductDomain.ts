import type { ApplicationConfiguration } from "seqflow-js";

export class ProductDomain {
	constructor(private applicationConfig: Readonly<ApplicationConfiguration>) {}

	async fetchProductsCategories(
		signal: AbortSignal,
	): Promise<ProductCategory[]> {
		const res = await fetch(
			`${this.applicationConfig.api.baseUrl}/products/categories`,
			{
				signal,
			},
		);
		const categories = (await res.json()) as string[];

		return categories.map((name, id) => {
			const url = `/images/categories/${name}.webp`;
			return { id: `${id}`, name, image: { url } };
		});
	}

	async fetchProductsByCategory(
		{ categoryId }: { categoryId: string },
		signal: AbortSignal,
	): Promise<Product[]> {
		const res = await fetch(
			`${this.applicationConfig.api.baseUrl}/products/category/${categoryId}`,
			{ signal },
		);
		return (await res.json()) as Product[];
	}
}

export interface ProductCategory {
	id: string;
	name: string;
	image: {
		url: string;
	};
}

export interface Product {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
}
