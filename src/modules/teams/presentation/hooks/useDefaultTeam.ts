import { useMutation } from "@tanstack/react-query";
import { SetDefaultTeamUseCase } from "@/modules/auth/application/useCases/SetDefaultTeamUseCase";
import { AuthRepository } from "@/modules/auth/infrastructure/repositories/AuthRepository";
import { useAuthState } from "@/modules/auth/presentation/hooks/useAuthState";

const authRepository = new AuthRepository();
const setDefaultTeamUseCase = new SetDefaultTeamUseCase(authRepository);

export function useDefaultTeam() {
	const { user } = useAuthState();

	const mutation = useMutation({
		mutationFn: (teamId: string | null) =>
			setDefaultTeamUseCase.execute(teamId),
	});

	return {
		defaultTeamId: user?.defaultTeamId ?? null,
		setDefault: mutation.mutate,
		isSaving: mutation.isPending,
	};
}
