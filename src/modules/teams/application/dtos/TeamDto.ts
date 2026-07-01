import type { TeamMemberRole } from "@/modules/teams/domain/entities/Team";

export interface CreateTeamDto {
	name: string;
	description?: string;
}

export type UpdateTeamDto = Partial<CreateTeamDto>;

export interface AddTeamMemberDto {
	email: string;
	role?: TeamMemberRole;
}
