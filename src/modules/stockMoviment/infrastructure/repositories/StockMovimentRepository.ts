import type {
	CreateStockMovimentDto,
	UpdateStockMovimentDto,
} from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import type { IStockMovimentRepository } from "@/modules/stockMoviment/domain/repositories/IStockMovimentRepository";
import { stockMovimentApiClient } from "@/modules/stockMoviment/infrastructure/api/stockMovimentApiClient";

export class StockMovimentRepository implements IStockMovimentRepository {
	findAll(): Promise<StockMoviment[]> {
		return stockMovimentApiClient.findAll();
	}

	findById(id: string): Promise<StockMoviment> {
		return stockMovimentApiClient.findById(id);
	}

	create(dto: CreateStockMovimentDto): Promise<StockMoviment> {
		return stockMovimentApiClient.create(dto);
	}

	update(id: string, dto: UpdateStockMovimentDto): Promise<StockMoviment> {
		return stockMovimentApiClient.update(id, dto);
	}

	delete(id: string): Promise<void> {
		return stockMovimentApiClient.delete(id);
	}
}
