"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * React Query Provider
 *
 * Creates the QueryClient inside state to prevent re-creation on re-renders.
 * Configured with sensible SaaS defaults:
 * - 5 min staleTime: Data is considered fresh for 5 minutes.
 * - 1 retry: Only retry failed requests once (avoid hammering a broken API).
 * - refetchOnWindowFocus: Re-sync data when user returns to the tab.
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
