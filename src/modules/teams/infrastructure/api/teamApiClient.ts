import type { AddTeamMemberDto, CreateTeamDto, UpdateTeamDto } from "@/modules/teams/application/dtos/TeamDto";
import type { Team, TeamMembership } from "@/modules/teams/domain/entities/Team";
import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";
import { httpClient } from "@/shared/http/httpClient";

function authHeaders(): Record<string, string> {
	const token = tokenStorage.getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export const teamApiClient = {
	listTeams(): Promise<Team[]> {
		return httpClient.get<Team[]>("/teams", { headers: authHeaders() });
	},

	getTeam(id: string): Promise<Team> {
		return httpClient.get<Team>(`/teams/${id}`, { headers: authHeaders() });
	},

	createTeam(dto: CreateTeamDto): Promise<Team> {
		return httpClient.post<Team>("/teams", dto, { headers: authHeaders() });
	},

	updateTeam(id: string, dto: UpdateTeamDto): Promise<Team> {
		return httpClient.put<Team>(`/teams/${id}`, dto, { headers: authHeaders() });
	},

	deleteTeam(id: string): Promise<void> {
		return httpClient.delete<void>(`/teams/${id}`, { headers: authHeaders() });
	},

	listMembers(teamId: string): Promise<TeamMembership[]> {
		return httpClient.get<TeamMembership[]>(`/teams/${teamId}/members`, {
			headers: authHeaders(),
		});
	},

	addMember(teamId: string, dto: AddTeamMemberDto): Promise<TeamMembership> {
		return httpClient.post<TeamMembership>(`/teams/${teamId}/members`, dto, {
			headers: authHeaders(),
		});
	},

	removeMember(teamId: string, memberId: string): Promise<void> {
		return httpClient.delete<void>(`/teams/${teamId}/members/${memberId}`, {
			headers: authHeaders(),
		});
	},
};
