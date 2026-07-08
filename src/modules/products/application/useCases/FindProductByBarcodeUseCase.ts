import type { Product } from "@/modules/products/domain/entities/Product";
import type { IProductRepository } from "@/modules/products/domain/repositories/IProductRepository";

export class FindProductByBarcodeUseCase {
	constructor(private readonly repository: IProductRepository) {}

	execute(teamId: string, barcode: string): Promise<Product> {
		return this.repository.findByBarcode(teamId, barcode);
	}
}
