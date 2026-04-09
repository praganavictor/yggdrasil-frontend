import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { LoginInputDto } from "@/modules/auth/application/dtos/LoginDto";
import { LoginUseCase } from "@/modules/auth/application/useCases/LoginUseCase";
import { AuthError } from "@/modules/auth/domain/errors/AuthError";
import { AuthRepository } from "@/modules/auth/infrastructure/repositories/AuthRepository";

const authRepository = new AuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

export function useLogin() {
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: (credentials: LoginInputDto) =>
			loginUseCase.execute(credentials),
		onSuccess: () => {
			router.navigate({ to: "/" });
		},
	});

	const errorMessage =
		mutation.error instanceof AuthError
			? mutation.error.message
			: mutation.error
				? "An unexpected error occurred. Please try again."
				: null;

	return {
		login: mutation.mutate,
		isPending: mutation.isPending,
		errorMessage,
		isError: mutation.isError,
	};
}
