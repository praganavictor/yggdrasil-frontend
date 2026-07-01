import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { StockMovimentQueryParams } from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import { GetStockMovimentsUseCase } from "@/modules/stockMoviment/application/useCases/GetStockMovimentsUseCase";
import { StockMovimentRepository } from "@/modules/stockMoviment/infrastructure/repositories/StockMovimentRepository";

const stockMovimentRepository = new StockMovimentRepository();
const getStockMovimentsUseCase = new GetStockMovimentsUseCase(
	stockMovimentRepository,
);

export const stockMovimentsQueryKey = (
	teamId: string,
	params?: StockMovimentQueryParams,
) => ["stock-moviments", teamId, params ?? {}] as const;

export function useStockMoviments(
	teamId: string | null,
	params?: StockMovimentQueryParams,
) {
	return useQuery({
		queryKey: stockMovimentsQueryKey(teamId ?? "", params),
		queryFn: () => getStockMovimentsUseCase.execute(teamId!, params),
		enabled: teamId !== null,
		placeholderData: keepPreviousData,
	});
}
