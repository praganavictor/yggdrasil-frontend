import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteStockMovimentUseCase } from "@/modules/stockMoviment/application/useCases/DeleteStockMovimentUseCase";
import { StockMovimentRepository } from "@/modules/stockMoviment/infrastructure/repositories/StockMovimentRepository";
import { stockMovimentsQueryKey } from "@/modules/stockMoviment/presentation/hooks/useStockMoviments";

const stockMovimentRepository = new StockMovimentRepository();
const deleteStockMovimentUseCase = new DeleteStockMovimentUseCase(
	stockMovimentRepository,
);

export function useDeleteStockMoviment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteStockMovimentUseCase.execute(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: stockMovimentsQueryKey });
		},
	});
}
