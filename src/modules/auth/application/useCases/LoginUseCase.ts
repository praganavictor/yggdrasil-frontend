import type {
	LoginInputDto,
	LoginOutputDto,
} from "@/modules/auth/application/dtos/LoginDto";
import { AuthError } from "@/modules/auth/domain/errors/AuthError";
import type { IAuthRepository } from "@/modules/auth/domain/repositories/IAuthRepository";
import { HttpError } from "@/shared/http/httpClient";

export class LoginUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(input: LoginInputDto): Promise<LoginOutputDto> {
		try {
			const result = await this.authRepository.login({
				email: input.email,
				password: input.password,
			});

			return {
				user: {
					id: result.user.id,
					email: result.user.email,
					name: result.user.name,
				},
			};
		} catch (error) {
			if (error instanceof AuthError) throw error;
			if (error instanceof HttpError) {
				throw new AuthError("UNKNOWN", "Unexpected HTTP error", error);
			}
			throw new AuthError("UNKNOWN", "An unexpected error occurred", error);
		}
	}
}
