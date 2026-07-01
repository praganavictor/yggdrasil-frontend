import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddTeamMemberDto } from "@/modules/teams/application/dtos/TeamDto";
import { AddTeamMemberUseCase } from "@/modules/teams/application/useCases/AddTeamMemberUseCase";
import { TeamRepository } from "@/modules/teams/infrastructure/repositories/TeamRepository";
import { teamMembersQueryKey } from "@/modules/teams/presentation/hooks/useTeamMembers";

const teamRepository = new TeamRepository();
const addTeamMemberUseCase = new AddTeamMemberUseCase(teamRepository);

export function useAddTeamMember(teamId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: AddTeamMemberDto) =>
			addTeamMemberUseCase.execute(teamId, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamMembersQueryKey(teamId) });
		},
	});
}
