export type AuthErrorCode =
	| "INVALID_CREDENTIALS"
	| "ACCOUNT_LOCKED"
	| "NETWORK_ERROR"
	| "UNKNOWN";

export class AuthError extends Error {
	constructor(
		public readonly code: AuthErrorCode,
		message: string,
		public readonly cause?: unknown,
	) {
		super(message);
		this.name = "AuthError";
	}
}
