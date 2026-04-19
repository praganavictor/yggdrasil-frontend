import type { IStockMovimentRepository } from "@/modules/stockMoviment/domain/repositories/IStockMovimentRepository";

export class DeleteStockMovimentUseCase {
	constructor(private readonly repository: IStockMovimentRepository) {}

	execute(id: string): Promise<void> {
		return this.repository.delete(id);
	}
}
