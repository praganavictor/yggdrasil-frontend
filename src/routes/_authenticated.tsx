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
		<div className="flex h-screen flex-col">
			<div className="sticky top-0 z-50">
				<Header />
			</div>
			<main className="flex-1 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	),
});
