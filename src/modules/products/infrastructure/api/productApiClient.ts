import type {
	CreateProductDto,
	UpdateProductDto,
} from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";
import { httpClient } from "@/shared/http/httpClient";

function authHeaders(): Record<string, string> {
	const token = tokenStorage.getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export const productApiClient = {
	findAll(): Promise<Product[]> {
		return httpClient.get<Product[]>("/products", {
			headers: authHeaders(),
		});
	},

	findById(id: string): Promise<Product> {
		return httpClient.get<Product>(`/products/${id}`, {
			headers: authHeaders(),
		});
	},

	create(dto: CreateProductDto): Promise<Product> {
		return httpClient.post<Product>("/products", dto, {
			headers: authHeaders(),
		});
	},

	update(id: string, dto: UpdateProductDto): Promise<Product> {
		return httpClient.put<Product>(`/products/${id}`, dto, {
			headers: authHeaders(),
		});
	},

	delete(id: string): Promise<void> {
		return httpClient.delete<void>(`/products/${id}`, {
			headers: authHeaders(),
		});
	},
};
