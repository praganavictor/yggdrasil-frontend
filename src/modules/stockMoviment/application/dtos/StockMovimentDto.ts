import type { StockMovimentType } from "@/modules/stockMoviment/domain/entities/StockMoviment";

export interface CreateStockMovimentDto {
	type: StockMovimentType;
	quantity: number;
	price: number;
	date: string;
	productId: string;
	teamId: string;
}

export type UpdateStockMovimentDto = Partial<Omit<CreateStockMovimentDto, "teamId">>;

export interface StockMovimentQueryParams {
	page?: number;
	limit?: number;
	productId?: string;
}
