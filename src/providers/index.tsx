"use client";

import type { ReactNode } from "react";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "sonner";

/**
 * AppProviders
 *
 * Single wrapper that composes all global providers.
 * Order matters:
 * 1. ThemeProvider (outermost — everything needs theme access)
 * 2. ReactQueryProvider (data layer)
 * 3. Toaster (notification system, positioned bottom-right)
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "!bg-surface-1 !text-foreground !border !border-border !shadow-lg",
            duration: 4000,
          }}
          richColors
        />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
