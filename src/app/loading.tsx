/**
 * Global Loading State
 *
 * Renders a premium skeleton loading screen while the root route
 * segment is loading. This is the first visual the user sees during
 * initial page load or navigation.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-4">
        {/* Animated brand mark */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        </div>

        {/* Loading text */}
        <p className="animate-pulse font-display text-sm tracking-wide text-foreground-tertiary">
          Loading...
        </p>
      </div>
    </div>
  );
}
