const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const AUTH_CHANGE_EVENT = "auth:change";

function emitAuthChange(): void {
	window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export const tokenStorage = {
	getToken(): string | null {
		return localStorage.getItem(TOKEN_KEY);
	},

	setToken(token: string): void {
		localStorage.setItem(TOKEN_KEY, token);
		emitAuthChange();
	},

	removeToken(): void {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
		emitAuthChange();
	},

	getUser(): { id: string; email: string; name: string } | null {
		const raw = localStorage.getItem(USER_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw) as { id: string; email: string; name: string };
		} catch {
			return null;
		}
	},

	setUser(user: { id: string; email: string; name: string }): void {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
	},

	isAuthenticated(): boolean {
		return this.getToken() !== null;
	},

	subscribe(callback: () => void): () => void {
		window.addEventListener(AUTH_CHANGE_EVENT, callback);
		return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
	},
};
