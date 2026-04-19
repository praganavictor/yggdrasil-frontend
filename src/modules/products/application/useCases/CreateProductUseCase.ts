import type { CreateProductDto } from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import type { IProductRepository } from "@/modules/products/domain/repositories/IProductRepository";

export class CreateProductUseCase {
	constructor(private readonly repository: IProductRepository) {}

	execute(dto: CreateProductDto): Promise<Product> {
		return this.repository.create(dto);
	}
}
