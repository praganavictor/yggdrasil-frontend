import type { User } from "@/modules/auth/domain/entities/User";
import type { IAuthRepository } from "@/modules/auth/domain/repositories/IAuthRepository";

export class SetDefaultTeamUseCase {
	constructor(private readonly repository: IAuthRepository) {}

	execute(teamId: string | null): Promise<User> {
		return this.repository.setDefaultTeam(teamId);
	}
}
