import type { ITeamRepository } from "@/modules/teams/domain/repositories/ITeamRepository";

export class RemoveTeamMemberUseCase {
	constructor(private readonly repository: ITeamRepository) {}

	execute(teamId: string, memberId: string): Promise<void> {
		return this.repository.removeMember(teamId, memberId);
	}
}
