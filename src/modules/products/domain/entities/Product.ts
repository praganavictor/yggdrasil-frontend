export interface Product {
	id: string;
	name: string;
	description: string;
	local: string;
	category: string;
	subcategory: string;
	unity: string;
	quantity: number;
	minumum: number;
	price: number;
	isPortioned: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export function createProduct(data: Product): Product {
	return { ...data };
}
