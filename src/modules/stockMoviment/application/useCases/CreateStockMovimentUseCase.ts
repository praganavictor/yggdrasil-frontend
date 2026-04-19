import type { CreateStockMovimentDto } from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import type { IStockMovimentRepository } from "@/modules/stockMoviment/domain/repositories/IStockMovimentRepository";

export class CreateStockMovimentUseCase {
	constructor(private readonly repository: IStockMovimentRepository) {}

	execute(dto: CreateStockMovimentDto): Promise<StockMoviment> {
		return this.repository.create(dto);
	}
}
