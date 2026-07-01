import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProductDto } from "@/modules/products/application/dtos/ProductDto";
import { CreateProductUseCase } from "@/modules/products/application/useCases/CreateProductUseCase";
import { ProductRepository } from "@/modules/products/infrastructure/repositories/ProductRepository";
import { productsQueryKey } from "@/modules/products/presentation/hooks/useProducts";

const productRepository = new ProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);

export function useCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ teamId, dto }: { teamId: string; dto: CreateProductDto }) =>
			createProductUseCase.execute(teamId, dto),
		onSuccess: (_data, { teamId }) => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey(teamId) });
		},
	});
}
