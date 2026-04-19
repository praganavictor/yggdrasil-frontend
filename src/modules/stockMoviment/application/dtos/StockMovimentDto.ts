import type { StockMovimentType } from "@/modules/stockMoviment/domain/entities/StockMoviment";

export interface CreateStockMovimentDto {
	type: StockMovimentType;
	quantity: number;
	price: number;
	date: string;
	productId: string;
}

export type UpdateStockMovimentDto = Partial<CreateStockMovimentDto>;
