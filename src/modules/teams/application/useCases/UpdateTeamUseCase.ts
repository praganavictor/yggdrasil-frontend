import type { UpdateTeamDto } from "@/modules/teams/application/dtos/TeamDto";
import type { Team } from "@/modules/teams/domain/entities/Team";
import type { ITeamRepository } from "@/modules/teams/domain/repositories/ITeamRepository";

export class UpdateTeamUseCase {
	constructor(private readonly repository: ITeamRepository) {}

	execute(id: string, dto: UpdateTeamDto): Promise<Team> {
		return this.repository.updateTeam(id, dto);
	}
}
