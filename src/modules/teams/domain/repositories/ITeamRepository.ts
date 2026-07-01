import type { Team, TeamMembership } from "@/modules/teams/domain/entities/Team";
import type {
	AddTeamMemberDto,
	CreateTeamDto,
	UpdateTeamDto,
} from "@/modules/teams/application/dtos/TeamDto";

export interface ITeamRepository {
	listTeams(): Promise<Team[]>;
	getTeam(id: string): Promise<Team>;
	createTeam(dto: CreateTeamDto): Promise<Team>;
	updateTeam(id: string, dto: UpdateTeamDto): Promise<Team>;
	deleteTeam(id: string): Promise<void>;
	listMembers(teamId: string): Promise<TeamMembership[]>;
	addMember(teamId: string, dto: AddTeamMemberDto): Promise<TeamMembership>;
	removeMember(teamId: string, memberId: string): Promise<void>;
}
