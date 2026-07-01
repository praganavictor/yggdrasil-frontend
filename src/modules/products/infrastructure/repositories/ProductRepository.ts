import type {
	CreateProductDto,
	ProductQueryParams,
	UpdateProductDto,
} from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import type { IProductRepository } from "@/modules/products/domain/repositories/IProductRepository";
import { productApiClient } from "@/modules/products/infrastructure/api/productApiClient";
import type { PaginatedResult } from "@/shared/types/pagination";

export class ProductRepository implements IProductRepository {
	findAll(
		teamId: string,
		params?: ProductQueryParams,
	): Promise<PaginatedResult<Product>> {
		return productApiClient.findAll(teamId, params);
	}

	findById(id: string): Promise<Product> {
		return productApiClient.findById(id);
	}

	create(teamId: string, dto: CreateProductDto): Promise<Product> {
		return productApiClient.create(teamId, dto);
	}

	update(id: string, dto: UpdateProductDto): Promise<Product> {
		return productApiClient.update(id, dto);
	}

	delete(id: string): Promise<void> {
		return productApiClient.delete(id);
	}
}
