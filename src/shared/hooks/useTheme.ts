import { useCallback, useSyncExternalStore } from "react";

const THEME_KEY = "theme";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function getStoredTheme(): Theme {
	if (localStorage.getItem(THEME_KEY) === "dark") return "dark";
	if (localStorage.getItem(THEME_KEY) === "light") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle("dark", theme === "dark");
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function useTheme() {
	const theme = useSyncExternalStore(subscribe, getStoredTheme);

	const toggleTheme = useCallback(() => {
		const next: Theme = getStoredTheme() === "dark" ? "light" : "dark";
		localStorage.setItem(THEME_KEY, next);
		applyTheme(next);
		for (const listener of listeners) listener();
	}, []);

	return { theme, toggleTheme };
}
