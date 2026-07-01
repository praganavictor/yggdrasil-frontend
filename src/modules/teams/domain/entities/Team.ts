export type TeamMemberRole = "ADMIN" | "SUPERVISOR" | "ATTENDANT";

export interface Team {
	id: string;
	name: string;
	description?: string;
	ownerId: string;
	createdAt?: string;
	updatedAt?: string;
	_count?: { members: number };
}

export interface TeamMembership {
	id: string;
	teamId: string;
	userId: string;
	joinedAt: string;
	role: TeamMemberRole;
	user: {
		id: string;
		name: string;
		email: string;
	};
}
