import { createFileRoute } from "@tanstack/react-router";
import { BarcodeScannerPage } from "@/modules/products/presentation/pages/BarcodeScannerPage";

export const Route = createFileRoute("/_authenticated/scanner/")({
	component: BarcodeScannerPage,
});
