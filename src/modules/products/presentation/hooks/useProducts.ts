import { useQuery } from "@tanstack/react-query";
import { GetProductsUseCase } from "@/modules/products/application/useCases/GetProductsUseCase";
import { ProductRepository } from "@/modules/products/infrastructure/repositories/ProductRepository";

const productRepository = new ProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepository);

export const productsQueryKey = ["products"] as const;

export function useProducts() {
	return useQuery({
		queryKey: productsQueryKey,
		queryFn: () => getProductsUseCase.execute(),
	});
}
