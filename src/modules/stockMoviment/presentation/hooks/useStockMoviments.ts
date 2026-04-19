import { useQuery } from "@tanstack/react-query";
import { GetStockMovimentsUseCase } from "@/modules/stockMoviment/application/useCases/GetStockMovimentsUseCase";
import { StockMovimentRepository } from "@/modules/stockMoviment/infrastructure/repositories/StockMovimentRepository";

const stockMovimentRepository = new StockMovimentRepository();
const getStockMovimentsUseCase = new GetStockMovimentsUseCase(
	stockMovimentRepository,
);

export const stockMovimentsQueryKey = ["stock-moviments"] as const;

export function useStockMoviments() {
	return useQuery({
		queryKey: stockMovimentsQueryKey,
		queryFn: () => getStockMovimentsUseCase.execute(),
	});
}
