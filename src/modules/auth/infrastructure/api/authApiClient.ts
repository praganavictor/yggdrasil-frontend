import type { ChangePasswordDto } from "@/modules/auth/application/dtos/ChangePasswordDto";
import { httpClient } from "@/shared/http/httpClient";

interface ApiUser {
	id: string;
	email: string;
	name: string;
	defaultTeamId: string | null;
}

interface ApiLoginResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	user: ApiUser;
}

export const authApiClient = {
	login(email: string, password: string): Promise<ApiLoginResponse> {
		return httpClient.post<ApiLoginResponse>("/authenticate", {
			email,
			password,
		});
	},

	logout(token: string): Promise<void> {
		return httpClient.post<void>("/logout", undefined, {
			headers: { Authorization: `Bearer ${token}` },
		});
	},

	me(token: string): Promise<ApiUser> {
		return httpClient.get<ApiUser>("/me", {
			headers: { Authorization: `Bearer ${token}` },
		});
	},

	changePassword(token: string, dto: ChangePasswordDto): Promise<void> {
		return httpClient.patch<void>("/change-password", dto, {
			headers: { Authorization: `Bearer ${token}` },
		});
	},

	setDefaultTeam(token: string, teamId: string | null): Promise<ApiUser> {
		return httpClient.patch<ApiUser>(
			"/me/default-team",
			{ teamId },
			{ headers: { Authorization: `Bearer ${token}` } },
		);
	},
};
