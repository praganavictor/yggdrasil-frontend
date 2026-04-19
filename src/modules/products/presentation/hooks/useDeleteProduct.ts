import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteProductUseCase } from "@/modules/products/application/useCases/DeleteProductUseCase";
import { ProductRepository } from "@/modules/products/infrastructure/repositories/ProductRepository";
import { productsQueryKey } from "@/modules/products/presentation/hooks/useProducts";

const productRepository = new ProductRepository();
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

export function useDeleteProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteProductUseCase.execute(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
		},
	});
}
