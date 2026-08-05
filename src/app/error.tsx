"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Global Error Boundary
 *
 * Catches runtime errors at the root level and displays a premium
 * fallback UI. Uses `retry` callback per Next.js 16 conventions.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Log to an external error reporting service (e.g., Sentry)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-6">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-bg">
          <AlertTriangle className="h-8 w-8 text-danger" />
        </div>

        {/* Message */}
        <h2 className="mb-2 font-display text-2xl font-medium text-foreground">
          Something went wrong
        </h2>
        <p className="mb-8 text-foreground-secondary">
          An unexpected error occurred. Our team has been notified. Please try
          again or contact support if the problem persists.
        </p>

        {/* Action */}
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-secondary shadow-sm transition-all duration-(--duration-micro) ease-decelerate hover:-translate-y-px hover:bg-primary-hover hover:shadow-md active:translate-y-px"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-6 font-mono text-xs text-foreground-tertiary">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
