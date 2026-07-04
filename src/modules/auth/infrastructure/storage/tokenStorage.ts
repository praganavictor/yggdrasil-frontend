const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";
const AUTH_CHANGE_EVENT = "auth:change";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function emitAuthChange(): void {
	window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export const tokenStorage = {
	getToken(): string | null {
		const token = localStorage.getItem(TOKEN_KEY);
		if (!token) return null;

		const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
		if (!expiry || Date.now() > Number(expiry)) {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(USER_KEY);
			localStorage.removeItem(TOKEN_EXPIRY_KEY);
			emitAuthChange();
			return null;
		}

		return token;
	},

	setToken(token: string): void {
		localStorage.setItem(TOKEN_KEY, token);
		localStorage.setItem(
			TOKEN_EXPIRY_KEY,
			String(Date.now() + SESSION_DURATION_MS),
		);
		emitAuthChange();
	},

	removeToken(): void {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
		localStorage.removeItem(TOKEN_EXPIRY_KEY);
		emitAuthChange();
	},

	getUser(): {
		id: string;
		email: string;
		name: string;
		defaultTeamId: string | null;
	} | null {
		const raw = localStorage.getItem(USER_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw) as {
				id: string;
				email: string;
				name: string;
				defaultTeamId: string | null;
			};
		} catch {
			return null;
		}
	},

	setUser(user: {
		id: string;
		email: string;
		name: string;
		defaultTeamId: string | null;
	}): void {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
		emitAuthChange();
	},

	isAuthenticated(): boolean {
		return this.getToken() !== null;
	},

	subscribe(callback: () => void): () => void {
		window.addEventListener(AUTH_CHANGE_EVENT, callback);
		return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
	},
};
