import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { LogoutUseCase } from "@/modules/auth/application/useCases/LogoutUseCase";
import { AuthRepository } from "@/modules/auth/infrastructure/repositories/AuthRepository";

const authRepository = new AuthRepository();
const logoutUseCase = new LogoutUseCase(authRepository);

export function useLogout() {
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: () => logoutUseCase.execute(),
		onSuccess: () => {
			router.navigate({ to: "/login" });
		},
	});

	return {
		logout: mutation.mutate,
		isPending: mutation.isPending,
	};
}
