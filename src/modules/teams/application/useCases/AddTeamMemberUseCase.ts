import type { AddTeamMemberDto } from "@/modules/teams/application/dtos/TeamDto";
import type { TeamMembership } from "@/modules/teams/domain/entities/Team";
import type { ITeamRepository } from "@/modules/teams/domain/repositories/ITeamRepository";

export class AddTeamMemberUseCase {
	constructor(private readonly repository: ITeamRepository) {}

	execute(teamId: string, dto: AddTeamMemberDto): Promise<TeamMembership> {
		return this.repository.addMember(teamId, dto);
	}
}
