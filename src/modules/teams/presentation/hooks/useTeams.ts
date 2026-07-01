import { useQuery } from "@tanstack/react-query";
import { ListTeamsUseCase } from "@/modules/teams/application/useCases/ListTeamsUseCase";
import { TeamRepository } from "@/modules/teams/infrastructure/repositories/TeamRepository";

const teamRepository = new TeamRepository();
const listTeamsUseCase = new ListTeamsUseCase(teamRepository);

export const teamsQueryKey = ["teams"] as const;

export function useTeams() {
	return useQuery({
		queryKey: teamsQueryKey,
		queryFn: () => listTeamsUseCase.execute(),
	});
}
