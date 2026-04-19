import type { Product } from "@/modules/products/domain/entities/Product";
import type {
	CreateProductDto,
	UpdateProductDto,
} from "@/modules/products/application/dtos/ProductDto";

export interface IProductRepository {
	findAll(): Promise<Product[]>;
	findById(id: string): Promise<Product>;
	create(dto: CreateProductDto): Promise<Product>;
	update(id: string, dto: UpdateProductDto): Promise<Product>;
	delete(id: string): Promise<void>;
}
