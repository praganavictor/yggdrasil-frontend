import type { IAuthRepository } from "@/modules/auth/domain/repositories/IAuthRepository";

export class LogoutUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(): Promise<void> {
		await this.authRepository.logout().catch(() => {
			// Swallow network errors — local logout must always succeed
		});
	}
}
