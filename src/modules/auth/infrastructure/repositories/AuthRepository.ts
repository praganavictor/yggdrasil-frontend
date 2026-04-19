import { createAuthToken } from "@/modules/auth/domain/entities/AuthToken";
import type { User } from "@/modules/auth/domain/entities/User";
import { createUser } from "@/modules/auth/domain/entities/User";
import { AuthError } from "@/modules/auth/domain/errors/AuthError";
import type {
	IAuthRepository,
	LoginCredentials,
	LoginResult,
} from "@/modules/auth/domain/repositories/IAuthRepository";
import { authApiClient } from "@/modules/auth/infrastructure/api/authApiClient";
import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";
import { HttpError } from "@/shared/http/httpClient";

export class AuthRepository implements IAuthRepository {
	async login(credentials: LoginCredentials): Promise<LoginResult> {
		try {
			const response = await authApiClient.login(
				credentials.email,
				credentials.password,
			);

			console.log("Login response:", response);

			const user = createUser(response.user);
			const token = createAuthToken(response);

			tokenStorage.setToken(token.accessToken);
			tokenStorage.setUser(response.user);

			return { user, token };
		} catch (error) {
			if (error instanceof HttpError) {
				const body = error.body as Record<string, unknown> | null;
				const message =
					typeof body?.message === "string"
						? body.message
						: "An error occurred. Please try again.";
				throw new AuthError("UNKNOWN", message);
			}
			if (error instanceof TypeError) {
				throw new AuthError(
					"NETWORK_ERROR",
					"Network error. Please check your connection.",
					error,
				);
			}
			throw new AuthError("UNKNOWN", "An error occurred. Please try again.", error);
		}
	}

	async logout(): Promise<void> {
		const token = tokenStorage.getToken();
		if (token) {
			await authApiClient.logout(token);
		}
		tokenStorage.removeToken();
	}

	async getCurrentUser(): Promise<User | null> {
		const storedUser = tokenStorage.getUser();
		if (!storedUser) return null;
		try {
			return createUser(storedUser);
		} catch {
			return null;
		}
	}
}
