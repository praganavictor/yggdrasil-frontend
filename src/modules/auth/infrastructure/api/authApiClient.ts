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
		return httpClient.delete<void>("/logout", {
			headers: { Authorization: `Bearer ${token}` },
		});
	},

	me(token: string): Promise<{ id: string; email: string; name: string }> {
		return httpClient.get<{ id: string; email: string; name: string }>(
			"/auth/me",
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
	},
};
