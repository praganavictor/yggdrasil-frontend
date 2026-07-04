import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 639px)";

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(
		() => window.matchMedia(MOBILE_QUERY).matches,
	);

	useEffect(() => {
		const mediaQuery = window.matchMedia(MOBILE_QUERY);
		const handleChange = (event: MediaQueryListEvent) =>
			setIsMobile(event.matches);
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	return isMobile;
}
