import { useQuery } from "@tanstack/react-query";
import { ListTeamMembersUseCase } from "@/modules/teams/application/useCases/ListTeamMembersUseCase";
import { TeamRepository } from "@/modules/teams/infrastructure/repositories/TeamRepository";

const teamRepository = new TeamRepository();
const listTeamMembersUseCase = new ListTeamMembersUseCase(teamRepository);

export const teamMembersQueryKey = (teamId: string) =>
	["teams", teamId, "members"] as const;

export function useTeamMembers(teamId: string | null) {
	return useQuery({
		queryKey: teamMembersQueryKey(teamId ?? ""),
		queryFn: () => listTeamMembersUseCase.execute(teamId!),
		enabled: teamId !== null,
	});
}
