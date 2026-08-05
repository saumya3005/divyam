import { useState, useEffect } from "react";

/**
 * useMediaQuery
 *
 * Reactively tracks whether a CSS media query matches.
 * Used to conditionally render different UIs on mobile vs. desktop
 * (e.g., rendering cards instead of tables on small screens).
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
