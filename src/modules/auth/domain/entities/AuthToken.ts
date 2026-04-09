export interface AuthToken {
	readonly accessToken: string;
	readonly tokenType: string;
	readonly expiresAt: number;
}

export function createAuthToken(raw: {
	access_token: string;
	token_type: string;
	expires_in: number;
}): AuthToken {
	return Object.freeze({
		accessToken: raw.access_token,
		tokenType: raw.token_type,
		expiresAt: Date.now() + raw.expires_in * 1000,
	});
}

export function isTokenExpired(token: AuthToken): boolean {
	return Date.now() >= token.expiresAt;
}
