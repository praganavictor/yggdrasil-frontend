import type { CreateTeamDto } from "@/modules/teams/application/dtos/TeamDto";
import type { Team } from "@/modules/teams/domain/entities/Team";
import type { ITeamRepository } from "@/modules/teams/domain/repositories/ITeamRepository";

export class CreateTeamUseCase {
	constructor(private readonly repository: ITeamRepository) {}

	execute(dto: CreateTeamDto): Promise<Team> {
		return this.repository.createTeam(dto);
	}
}
