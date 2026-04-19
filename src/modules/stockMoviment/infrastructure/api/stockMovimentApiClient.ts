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

export const stockMovimentApiClient = {
	findAll(): Promise<StockMoviment[]> {
		return httpClient.get<StockMoviment[]>("/stock-moviment", {
			headers: authHeaders(),
		});
	},

	findById(id: string): Promise<StockMoviment> {
		return httpClient.get<StockMoviment>(`/stock-moviment/${id}`, {
			headers: authHeaders(),
		});
	},

	create(dto: CreateStockMovimentDto): Promise<StockMoviment> {
		return httpClient.post<StockMoviment>("/stock-moviment", dto, {
			headers: authHeaders(),
		});
	},

	update(id: string, dto: UpdateStockMovimentDto): Promise<StockMoviment> {
		return httpClient.put<StockMoviment>(`/stock-moviment/${id}`, dto, {
			headers: authHeaders(),
		});
	},

	delete(id: string): Promise<void> {
		return httpClient.delete<void>(`/stock-moviment/${id}`, {
			headers: authHeaders(),
		});
	},
};
