import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTeamDto } from "@/modules/teams/application/dtos/TeamDto";
import { CreateTeamUseCase } from "@/modules/teams/application/useCases/CreateTeamUseCase";
import { TeamRepository } from "@/modules/teams/infrastructure/repositories/TeamRepository";
import { teamsQueryKey } from "@/modules/teams/presentation/hooks/useTeams";

const teamRepository = new TeamRepository();
const createTeamUseCase = new CreateTeamUseCase(teamRepository);

export function useCreateTeam() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: CreateTeamDto) => createTeamUseCase.execute(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamsQueryKey });
		},
	});
}
