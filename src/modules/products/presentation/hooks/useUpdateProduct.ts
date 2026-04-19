import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProductDto } from "@/modules/products/application/dtos/ProductDto";
import { UpdateProductUseCase } from "@/modules/products/application/useCases/UpdateProductUseCase";
import { ProductRepository } from "@/modules/products/infrastructure/repositories/ProductRepository";
import { productsQueryKey } from "@/modules/products/presentation/hooks/useProducts";

const productRepository = new ProductRepository();
const updateProductUseCase = new UpdateProductUseCase(productRepository);

export function useUpdateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
			updateProductUseCase.execute(id, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
		},
	});
}
