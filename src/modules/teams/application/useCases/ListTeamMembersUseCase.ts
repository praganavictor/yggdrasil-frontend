import type { TeamMembership } from "@/modules/teams/domain/entities/Team";
import type { ITeamRepository } from "@/modules/teams/domain/repositories/ITeamRepository";

export class ListTeamMembersUseCase {
	constructor(private readonly repository: ITeamRepository) {}

	execute(teamId: string): Promise<TeamMembership[]> {
		return this.repository.listMembers(teamId);
	}
}
