import type { AddTeamMemberDto, CreateTeamDto, UpdateTeamDto } from "@/modules/teams/application/dtos/TeamDto";
import type { Team, TeamMembership } from "@/modules/teams/domain/entities/Team";
import type { ITeamRepository } from "@/modules/teams/domain/repositories/ITeamRepository";
import { teamApiClient } from "@/modules/teams/infrastructure/api/teamApiClient";

export class TeamRepository implements ITeamRepository {
	listTeams(): Promise<Team[]> {
		return teamApiClient.listTeams();
	}

	getTeam(id: string): Promise<Team> {
		return teamApiClient.getTeam(id);
	}

	createTeam(dto: CreateTeamDto): Promise<Team> {
		return teamApiClient.createTeam(dto);
	}

	updateTeam(id: string, dto: UpdateTeamDto): Promise<Team> {
		return teamApiClient.updateTeam(id, dto);
	}

	deleteTeam(id: string): Promise<void> {
		return teamApiClient.deleteTeam(id);
	}

	listMembers(teamId: string): Promise<TeamMembership[]> {
		return teamApiClient.listMembers(teamId);
	}

	addMember(teamId: string, dto: AddTeamMemberDto): Promise<TeamMembership> {
		return teamApiClient.addMember(teamId, dto);
	}

	removeMember(teamId: string, memberId: string): Promise<void> {
		return teamApiClient.removeMember(teamId, memberId);
	}
}
