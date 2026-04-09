import { createFileRoute, redirect } from "@tanstack/react-router";
import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";
import { LoginPage } from "@/modules/auth/presentation/pages/LoginPage";

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		if (tokenStorage.isAuthenticated()) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});
