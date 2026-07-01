import { useState } from "react";
import { defaultTeamStorage } from "@/shared/storage/defaultTeamStorage";

export function useDefaultTeam() {
	const [defaultTeamId, setDefaultTeamId] = useState<string | null>(
		() => defaultTeamStorage.get(),
	);

	function setDefault(teamId: string | null) {
		if (teamId) {
			defaultTeamStorage.set(teamId);
		} else {
			defaultTeamStorage.clear();
		}
		setDefaultTeamId(teamId);
	}

	return { defaultTeamId, setDefault };
}
