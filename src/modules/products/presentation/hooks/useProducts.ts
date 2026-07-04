import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ProductQueryParams } from "@/modules/products/application/dtos/ProductDto";
import { GetProductsUseCase } from "@/modules/products/application/useCases/GetProductsUseCase";
import { ProductRepository } from "@/modules/products/infrastructure/repositories/ProductRepository";

const productRepository = new ProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepository);

export const productsQueryKey = (teamId: string, params?: ProductQueryParams) =>
	["products", teamId, params ?? {}] as const;

export function useProducts(
	teamId: string | null,
	params?: ProductQueryParams,
) {
	return useQuery({
		queryKey: productsQueryKey(teamId ?? "", params),
		queryFn: () => getProductsUseCase.execute(teamId!, params),
		enabled: teamId !== null,
		placeholderData: keepPreviousData,
	});
}
