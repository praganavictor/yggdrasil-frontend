import type { UpdateProductDto } from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import type { IProductRepository } from "@/modules/products/domain/repositories/IProductRepository";

export class UpdateProductUseCase {
	constructor(private readonly repository: IProductRepository) {}

	execute(id: string, dto: UpdateProductDto): Promise<Product> {
		return this.repository.update(id, dto);
	}
}
