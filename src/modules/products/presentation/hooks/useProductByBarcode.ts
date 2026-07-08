import { useQuery } from "@tanstack/react-query";
import { FindProductByBarcodeUseCase } from "@/modules/products/application/useCases/FindProductByBarcodeUseCase";
import { ProductRepository } from "@/modules/products/infrastructure/repositories/ProductRepository";
import { HttpError } from "@/shared/http/httpClient";

const productRepository = new ProductRepository();
const findProductByBarcodeUseCase = new FindProductByBarcodeUseCase(
	productRepository,
);

export const productByBarcodeQueryKey = (teamId: string, barcode: string) =>
	["products", teamId, "barcode", barcode] as const;

export function useProductByBarcode(
	teamId: string | null,
	barcode: string | null,
) {
	const query = useQuery({
		queryKey: productByBarcodeQueryKey(teamId ?? "", barcode ?? ""),
		queryFn: () => findProductByBarcodeUseCase.execute(teamId!, barcode!),
		enabled: teamId !== null && barcode !== null && barcode.length > 0,
		retry: (failureCount, error) => {
			if (error instanceof HttpError && error.status === 404) return false;
			return failureCount < 2;
		},
	});

	const isNotFound =
		query.error instanceof HttpError && query.error.status === 404;

	return { ...query, isNotFound };
}
