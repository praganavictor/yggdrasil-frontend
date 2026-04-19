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
		mutationFn: (dto: CreateProductDto) => createProductUseCase.execute(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
		},
	});
}
