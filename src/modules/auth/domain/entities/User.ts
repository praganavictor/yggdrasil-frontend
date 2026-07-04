export interface User {
	readonly id: string;
	readonly email: string;
	readonly name: string;
	readonly defaultTeamId: string | null;
}

export function createUser(raw: {
	id: string;
	email: string;
	name: string;
	defaultTeamId?: string | null;
}): User {
	if (!raw.id) throw new Error("User id is required");
	if (!raw.email || !raw.email.includes("@")) throw new Error("Invalid email");
	return Object.freeze({
		id: raw.id,
		email: raw.email,
		name: raw.name,
		defaultTeamId: raw.defaultTeamId ?? null,
	});
}
