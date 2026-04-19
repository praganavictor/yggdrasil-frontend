import type {
	CreateStockMovimentDto,
	UpdateStockMovimentDto,
} from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";

export interface IStockMovimentRepository {
	findAll(): Promise<StockMoviment[]>;
	findById(id: string): Promise<StockMoviment>;
	create(dto: CreateStockMovimentDto): Promise<StockMoviment>;
	update(id: string, dto: UpdateStockMovimentDto): Promise<StockMoviment>;
	delete(id: string): Promise<void>;
}
