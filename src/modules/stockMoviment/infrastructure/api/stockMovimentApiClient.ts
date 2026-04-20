import type {
	CreateStockMovimentDto,
	UpdateStockMovimentDto,
} from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";
import { httpClient } from "@/shared/http/httpClient";

function authHeaders(): Record<string, string> {
	const token = tokenStorage.getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

interface PaginatedResponse<T> {
	data: T[];
	meta: { total: number; page: number; limit: number; totalPages: number };
}

export const stockMovimentApiClient = {
	findAll(): Promise<StockMoviment[]> {
		return httpClient
			.get<PaginatedResponse<StockMoviment>>("/stock-movements", { headers: authHeaders()})
			.then((res) => res.data);
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
