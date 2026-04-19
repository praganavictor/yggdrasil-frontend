import type { Product } from "@/modules/products/domain/entities/Product";
import type { IProductRepository } from "@/modules/products/domain/repositories/IProductRepository";

export class GetProductsUseCase {
	constructor(private readonly repository: IProductRepository) {}

	execute(): Promise<Product[]> {
		return this.repository.findAll();
	}
}
