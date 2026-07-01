import type {
	CreateStockMovimentDto,
	StockMovimentQueryParams,
	UpdateStockMovimentDto,
} from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";
import { httpClient } from "@/shared/http/httpClient";
import type { PaginatedResult } from "@/shared/types/pagination";

function authHeaders(): Record<string, string> {
	const token = tokenStorage.getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export const stockMovimentApiClient = {
	findAll(
		teamId: string,
		params?: StockMovimentQueryParams,
	): Promise<PaginatedResult<StockMoviment>> {
		const query = new URLSearchParams({ teamId });
		if (params?.page) query.set("page", String(params.page));
		if (params?.limit) query.set("limit", String(params.limit));
		if (params?.productId) query.set("productId", params.productId);

		return httpClient.get<PaginatedResult<StockMoviment>>(
			`/stock-movements?${query.toString()}`,
			{ headers: authHeaders() },
		);
	},

	findById(id: string): Promise<StockMoviment> {
		return httpClient.get<StockMoviment>(`/stock-movements/${id}`, {
			headers: authHeaders(),
		});
	},

	create(dto: CreateStockMovimentDto): Promise<StockMoviment> {
		return httpClient.post<StockMoviment>("/stock-movements", dto, {
			headers: authHeaders(),
		});
	},

	update(id: string, dto: UpdateStockMovimentDto): Promise<StockMoviment> {
		return httpClient.put<StockMoviment>(`/stock-movements/${id}`, dto, {
			headers: authHeaders(),
		});
	},

	delete(id: string): Promise<void> {
		return httpClient.delete<void>(`/stock-movements/${id}`, {
			headers: authHeaders(),
		});
	},
};
