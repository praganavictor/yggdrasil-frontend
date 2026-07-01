import type { ChangePasswordDto } from "@/modules/auth/application/dtos/ChangePasswordDto";
import type { IAuthRepository } from "@/modules/auth/domain/repositories/IAuthRepository";

export class ChangePasswordUseCase {
	constructor(private readonly repository: IAuthRepository) {}

	execute(dto: ChangePasswordDto): Promise<void> {
		return this.repository.changePassword(dto);
	}
}
