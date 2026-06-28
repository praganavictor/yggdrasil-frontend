import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/modules/dashboard/presentation/pages/DashboardPage";

export const Route = createFileRoute("/_authenticated/")({
	component: DashboardPage,
});
