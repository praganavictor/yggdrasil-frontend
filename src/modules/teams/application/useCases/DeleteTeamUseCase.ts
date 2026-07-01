import type { ITeamRepository } from "@/modules/teams/domain/repositories/ITeamRepository";

export class DeleteTeamUseCase {
	constructor(private readonly repository: ITeamRepository) {}

	execute(id: string): Promise<void> {
		return this.repository.deleteTeam(id);
	}
}
