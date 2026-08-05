"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Theme Provider
 *
 * Wraps `next-themes` to provide class-based dark mode switching.
 * - `attribute="class"` maps to Tailwind's `darkMode: 'class'` via CSS `.dark`.
 * - `defaultTheme="dark"` because our luxury SaaS aesthetic favors dark by default.
 * - `enableSystem` respects user OS preferences.
 * - `disableTransitionOnChange` prevents a FOUC (flash) when toggling themes.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
