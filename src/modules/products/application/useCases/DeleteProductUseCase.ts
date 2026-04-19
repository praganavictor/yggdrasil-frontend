import type { IProductRepository } from "@/modules/products/domain/repositories/IProductRepository";

export class DeleteProductUseCase {
	constructor(private readonly repository: IProductRepository) {}

	execute(id: string): Promise<void> {
		return this.repository.delete(id);
	}
}
