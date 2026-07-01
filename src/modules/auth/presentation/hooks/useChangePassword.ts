import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordDto } from "@/modules/auth/application/dtos/ChangePasswordDto";
import { ChangePasswordUseCase } from "@/modules/auth/application/useCases/ChangePasswordUseCase";
import { AuthRepository } from "@/modules/auth/infrastructure/repositories/AuthRepository";

const authRepository = new AuthRepository();
const changePasswordUseCase = new ChangePasswordUseCase(authRepository);

export function useChangePassword() {
	return useMutation({
		mutationFn: (dto: ChangePasswordDto) => changePasswordUseCase.execute(dto),
	});
}
