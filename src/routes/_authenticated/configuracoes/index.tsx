import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/modules/settings/presentation/pages/SettingsPage";

export const Route = createFileRoute("/_authenticated/configuracoes/")({
	component: SettingsPage,
});
