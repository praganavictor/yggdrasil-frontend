import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "@/components/Header";
import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: () => {
		if (!tokenStorage.isAuthenticated()) {
			throw redirect({ to: "/login" });
		}
	},
	component: () => (
		<>
			<Header />
			<Outlet />
		</>
	),
});
