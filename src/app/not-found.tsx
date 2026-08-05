import Link from "next/link";
import { Home } from "lucide-react";

/**
 * 404 Not Found
 *
 * A premium branded 404 page matching the design system.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-6">
      <div className="mx-auto max-w-md text-center">
        {/* Large 404 */}
        <h1 className="font-display text-8xl font-medium text-gradient-primary">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 font-display text-2xl font-medium text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-foreground-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-secondary shadow-sm transition-all duration-(--duration-micro) ease-decelerate hover:-translate-y-px hover:bg-primary-hover hover:shadow-md active:translate-y-px"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
