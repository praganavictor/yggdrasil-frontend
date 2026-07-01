import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteTeamUseCase } from "@/modules/teams/application/useCases/DeleteTeamUseCase";
import { TeamRepository } from "@/modules/teams/infrastructure/repositories/TeamRepository";
import { teamsQueryKey } from "@/modules/teams/presentation/hooks/useTeams";

const teamRepository = new TeamRepository();
const deleteTeamUseCase = new DeleteTeamUseCase(teamRepository);

export function useDeleteTeam() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteTeamUseCase.execute(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamsQueryKey });
		},
	});
}
