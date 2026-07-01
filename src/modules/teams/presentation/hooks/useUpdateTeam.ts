import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateTeamDto } from "@/modules/teams/application/dtos/TeamDto";
import { UpdateTeamUseCase } from "@/modules/teams/application/useCases/UpdateTeamUseCase";
import { TeamRepository } from "@/modules/teams/infrastructure/repositories/TeamRepository";
import { teamsQueryKey } from "@/modules/teams/presentation/hooks/useTeams";

const teamRepository = new TeamRepository();
const updateTeamUseCase = new UpdateTeamUseCase(teamRepository);

export function useUpdateTeam() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateTeamDto }) =>
			updateTeamUseCase.execute(id, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamsQueryKey });
		},
	});
}
