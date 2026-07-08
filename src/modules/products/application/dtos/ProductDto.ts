export interface CreateProductDto {
	name: string;
	description: string;
	barcode?: string;
	local: string;
	category: string;
	subcategory: string;
	unity: string;
	quantity: number;
	minumum: number;
	price: number;
	isPortioned: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductQueryParams {
	page?: number;
	limit?: number;
	category?: string;
	isPortioned?: boolean;
	belowMinimum?: boolean;
	outOfStock?: boolean;
}
