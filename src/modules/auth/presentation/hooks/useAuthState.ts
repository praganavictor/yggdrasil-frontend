import { useCallback, useEffect, useState } from "react";
import { tokenStorage } from "@/modules/auth/infrastructure/storage/tokenStorage";

interface AuthState {
	isAuthenticated: boolean;
	user: { id: string; email: string; name: string } | null;
}

function getSnapshot(): AuthState {
	return {
		isAuthenticated: tokenStorage.isAuthenticated(),
		user: tokenStorage.getUser(),
	};
}

export function useAuthState(): AuthState {
	const [state, setState] = useState<AuthState>(getSnapshot);

	const sync = useCallback(() => {
		setState(getSnapshot());
	}, []);

	useEffect(() => {
		return tokenStorage.subscribe(sync);
	}, [sync]);

	return state;
}
