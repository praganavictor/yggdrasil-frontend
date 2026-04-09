import type { AuthToken } from "@/modules/auth/domain/entities/AuthToken";
import type { User } from "@/modules/auth/domain/entities/User";

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginResult {
	user: User;
	token: AuthToken;
}

export interface IAuthRepository {
	login(credentials: LoginCredentials): Promise<LoginResult>;
	logout(): Promise<void>;
	getCurrentUser(): Promise<User | null>;
}
