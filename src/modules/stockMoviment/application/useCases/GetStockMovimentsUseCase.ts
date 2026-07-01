import type { StockMovimentQueryParams } from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import type { IStockMovimentRepository } from "@/modules/stockMoviment/domain/repositories/IStockMovimentRepository";
import type { PaginatedResult } from "@/shared/types/pagination";

export class GetStockMovimentsUseCase {
	constructor(private readonly repository: IStockMovimentRepository) {}

	execute(
		teamId: string,
		params?: StockMovimentQueryParams,
	): Promise<PaginatedResult<StockMoviment>> {
		return this.repository.findAll(teamId, params);
	}
}
