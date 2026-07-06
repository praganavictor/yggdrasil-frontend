import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";
import type {
	CreateProductDto,
	ProductQueryParams,
	UpdateProductDto,
} from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import { httpClient } from "@/shared/http/httpClient";
import type { PaginatedResult } from "@/shared/types/pagination";

function authHeaders(): Record<string, string> {
	const token = tokenStorage.getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export const productApiClient = {
	findAll(
		teamId: string,
		params?: ProductQueryParams,
	): Promise<PaginatedResult<Product>> {
		const query = new URLSearchParams();
		if (params?.page) query.set("page", String(params.page));
		if (params?.limit) query.set("limit", String(params.limit));
		if (params?.category) query.set("category", params.category);
		if (params?.isPortioned !== undefined) {
			query.set("isPortioned", String(params.isPortioned));
		}
		if (params?.belowMinimum) query.set("belowMinimum", "true");
		if (params?.outOfStock) query.set("outOfStock", "true");
		const queryString = query.toString();

		return httpClient.get<PaginatedResult<Product>>(
			`/teams/${teamId}/products${queryString ? `?${queryString}` : ""}`,
			{ headers: authHeaders() },
		);
	},

	findById(id: string): Promise<Product> {
		return httpClient.get<Product>(`/products/${id}`, {
			headers: authHeaders(),
		});
	},

	create(teamId: string, dto: CreateProductDto): Promise<Product> {
		return httpClient.post<Product>(`/teams/${teamId}/products`, dto, {
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
