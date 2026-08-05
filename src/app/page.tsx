import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Home Page (Landing / Splash)
 *
 * Temporary entry point that showcases the design system tokens
 * are working correctly. Will be replaced with a proper landing
 * page or redirect to /dashboard once auth is implemented.
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-base px-6">
      {/* Decorative background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-125 w-125 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-100 w-100 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-pill border border-border bg-surface-1 px-4 py-1.5 text-xs font-medium text-foreground-secondary shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Design System Active
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl font-medium leading-tight tracking-tight text-foreground md:text-6xl">
          Welcome to{" "}
          <span className="text-gradient-primary">Divyam</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-lg text-lg text-foreground-secondary">
          Premium Event Booking & Management Platform. Enterprise-grade
          sophistication, effortless experience.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-3.5 text-sm font-medium text-secondary shadow-glow transition-all duration-(--duration-micro) ease-decelerate hover:-translate-y-px hover:bg-primary-hover hover:shadow-lg active:translate-y-px"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform duration-(--duration-micro) group-hover:translate-x-1" />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface-1 px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-(--duration-micro) ease-decelerate hover:-translate-y-px hover:border-border-hover hover:shadow-md active:translate-y-px"
          >
            View Dashboard
          </Link>
        </div>

        {/* Design Token Showcase */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Champagne", className: "bg-primary" },
            { label: "Copper", className: "bg-accent" },
            { label: "Forest", className: "bg-secondary" },
            { label: "Success", className: "bg-success" },
          ].map(({ label, className }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`h-12 w-12 rounded-lg ${className} shadow-md`}
              />
              <span className="text-xs text-foreground-tertiary">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
