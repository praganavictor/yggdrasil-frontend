import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RemoveTeamMemberUseCase } from "@/modules/teams/application/useCases/RemoveTeamMemberUseCase";
import { TeamRepository } from "@/modules/teams/infrastructure/repositories/TeamRepository";
import { teamMembersQueryKey } from "@/modules/teams/presentation/hooks/useTeamMembers";

const teamRepository = new TeamRepository();
const removeTeamMemberUseCase = new RemoveTeamMemberUseCase(teamRepository);

export function useRemoveTeamMember(teamId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (memberId: string) =>
			removeTeamMemberUseCase.execute(teamId, memberId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamMembersQueryKey(teamId) });
		},
	});
}
