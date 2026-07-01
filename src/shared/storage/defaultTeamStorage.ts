const KEY = "default_team_id";

export const defaultTeamStorage = {
	get(): string | null {
		return localStorage.getItem(KEY);
	},
	set(teamId: string): void {
		localStorage.setItem(KEY, teamId);
	},
	clear(): void {
		localStorage.removeItem(KEY);
	},
};
