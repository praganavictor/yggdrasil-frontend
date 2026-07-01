import type { ChangePasswordDto } from "@/modules/auth/application/dtos/ChangePasswordDto";
import { httpClient } from "@/shared/http/httpClient";

interface ApiLoginResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	user: {
		id: string;
		email: string;
		name: string;
	};
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

	me(token: string): Promise<{ id: string; email: string; name: string }> {
		return httpClient.get<{ id: string; email: string; name: string }>("/me", {
			headers: { Authorization: `Bearer ${token}` },
		});
	},

	changePassword(token: string, dto: ChangePasswordDto): Promise<void> {
		return httpClient.patch<void>("/change-password", dto, {
			headers: { Authorization: `Bearer ${token}` },
		});
	},
};
