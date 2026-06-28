import { createFileRoute } from "@tanstack/react-router";
import { StockMovimentsPage } from "@/modules/stockMoviment/presentation/pages/StockMovimentsPage";

export const Route = createFileRoute("/_authenticated/movimentacoes/")({
	component: StockMovimentsPage,
});
