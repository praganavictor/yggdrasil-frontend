import { useQueries } from "@tanstack/react-query";
import { GetProductsUseCase } from "@/modules/products/application/useCases/GetProductsUseCase";
import type { Product } from "@/modules/products/domain/entities/Product";
import { ProductRepository } from "@/modules/products/infrastructure/repositories/ProductRepository";
import { productsQueryKey } from "@/modules/products/presentation/hooks/useProducts";
import { GetStockMovimentsUseCase } from "@/modules/stockMoviment/application/useCases/GetStockMovimentsUseCase";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import { StockMovimentRepository } from "@/modules/stockMoviment/infrastructure/repositories/StockMovimentRepository";
import { stockMovimentsQueryKey } from "@/modules/stockMoviment/presentation/hooks/useStockMoviments";
import type { Team } from "@/modules/teams/domain/entities/Team";

const productRepository = new ProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepository);
const stockMovimentRepository = new StockMovimentRepository();
const getStockMovimentsUseCase = new GetStockMovimentsUseCase(
	stockMovimentRepository,
);

// Mesmos params usados nas telas individuais para compartilhar o cache
const listParams = { limit: 1000 };

export interface TeamSummary {
	team: Team;
	products: Product[];
	moviments: StockMoviment[];
	isLoading: boolean;
}

export function useTeamsSummaries(teams: Team[]) {
	const productQueries = useQueries({
		queries: teams.map((team) => ({
			queryKey: productsQueryKey(team.id, listParams),
			queryFn: () => getProductsUseCase.execute(team.id, listParams),
		})),
	});

	const movimentQueries = useQueries({
		queries: teams.map((team) => ({
			queryKey: stockMovimentsQueryKey(team.id, listParams),
			queryFn: () => getStockMovimentsUseCase.execute(team.id, listParams),
		})),
	});

	const summaries: TeamSummary[] = teams.map((team, index) => ({
		team,
		products: productQueries[index]?.data?.data ?? [],
		moviments: movimentQueries[index]?.data?.data ?? [],
		isLoading:
			(productQueries[index]?.isLoading ?? false) ||
			(movimentQueries[index]?.isLoading ?? false),
	}));

	return {
		summaries,
		isLoading: summaries.some((summary) => summary.isLoading),
	};
}
