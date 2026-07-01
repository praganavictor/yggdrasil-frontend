import { createFileRoute } from "@tanstack/react-router";
import { TeamsPage } from "@/modules/teams/presentation/pages/TeamsPage";

export const Route = createFileRoute("/_authenticated/equipes/")({
	component: TeamsPage,
});
