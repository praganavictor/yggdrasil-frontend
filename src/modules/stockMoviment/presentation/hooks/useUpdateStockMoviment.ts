import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateStockMovimentDto } from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import { UpdateStockMovimentUseCase } from "@/modules/stockMoviment/application/useCases/UpdateStockMovimentUseCase";
import { StockMovimentRepository } from "@/modules/stockMoviment/infrastructure/repositories/StockMovimentRepository";
const stockMovimentRepository = new StockMovimentRepository();
const updateStockMovimentUseCase = new UpdateStockMovimentUseCase(
	stockMovimentRepository,
);

export function useUpdateStockMoviment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateStockMovimentDto }) =>
			updateStockMovimentUseCase.execute(id, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["stock-moviments"] });
		},
	});
}
