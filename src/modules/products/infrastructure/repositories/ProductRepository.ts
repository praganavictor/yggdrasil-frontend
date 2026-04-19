import type {
	CreateProductDto,
	UpdateProductDto,
} from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import type { IProductRepository } from "@/modules/products/domain/repositories/IProductRepository";
import { productApiClient } from "@/modules/products/infrastructure/api/productApiClient";

export class ProductRepository implements IProductRepository {
	findAll(): Promise<Product[]> {
		return productApiClient.findAll();
	}

	findById(id: string): Promise<Product> {
		return productApiClient.findById(id);
	}

	create(dto: CreateProductDto): Promise<Product> {
		return productApiClient.create(dto);
	}

	update(id: string, dto: UpdateProductDto): Promise<Product> {
		return productApiClient.update(id, dto);
	}

	delete(id: string): Promise<void> {
		return productApiClient.delete(id);
	}
}
