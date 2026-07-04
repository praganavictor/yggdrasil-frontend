import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateStockMovimentDto } from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import { CreateStockMovimentUseCase } from "@/modules/stockMoviment/application/useCases/CreateStockMovimentUseCase";
import { StockMovimentRepository } from "@/modules/stockMoviment/infrastructure/repositories/StockMovimentRepository";
import { stockMovimentsQueryKey } from "@/modules/stockMoviment/presentation/hooks/useStockMoviments";

const stockMovimentRepository = new StockMovimentRepository();
const createStockMovimentUseCase = new CreateStockMovimentUseCase(
	stockMovimentRepository,
);

export function useCreateStockMoviment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: CreateStockMovimentDto) =>
			createStockMovimentUseCase.execute(dto),
		onSuccess: (_data, dto) => {
			queryClient.invalidateQueries({
				queryKey: stockMovimentsQueryKey(dto.teamId),
			});
			queryClient.invalidateQueries({
				queryKey: ["products", dto.teamId],
			});
		},
	});
}
