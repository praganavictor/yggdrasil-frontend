import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import type { IStockMovimentRepository } from "@/modules/stockMoviment/domain/repositories/IStockMovimentRepository";

export class GetStockMovimentsUseCase {
	constructor(private readonly repository: IStockMovimentRepository) {}

	execute(): Promise<StockMoviment[]> {
		return this.repository.findAll();
	}
}
