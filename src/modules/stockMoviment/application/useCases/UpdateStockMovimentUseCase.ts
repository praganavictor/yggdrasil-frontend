import type { UpdateStockMovimentDto } from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import type { IStockMovimentRepository } from "@/modules/stockMoviment/domain/repositories/IStockMovimentRepository";

export class UpdateStockMovimentUseCase {
	constructor(private readonly repository: IStockMovimentRepository) {}

	execute(id: string, dto: UpdateStockMovimentDto): Promise<StockMoviment> {
		return this.repository.update(id, dto);
	}
}
