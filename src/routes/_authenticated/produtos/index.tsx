import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/modules/products/presentation/pages/ProductsPage";

export const Route = createFileRoute("/_authenticated/produtos/")({
	component: ProductsPage,
});
