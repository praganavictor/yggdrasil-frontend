export interface CreateProductDto {
	name: string;
	description: string;
	local: string;
	category: string;
	subcategory: string;
	unity: string;
	quantity: number;
	minumum: number;
	price: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;
