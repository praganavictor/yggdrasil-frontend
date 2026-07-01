import type { Team } from "@/modules/teams/domain/entities/Team";
import type { ITeamRepository } from "@/modules/teams/domain/repositories/ITeamRepository";

export class ListTeamsUseCase {
	constructor(private readonly repository: ITeamRepository) {}

	execute(): Promise<Team[]> {
		return this.repository.listTeams();
	}
}
