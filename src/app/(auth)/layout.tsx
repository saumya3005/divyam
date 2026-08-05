import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

/**
 * Auth Layout
 *
 * A layout specifically for authentication screens (Login, Register,
 * Forgot Password). No sidebar, no navbar — a clean split-screen layout.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left — Abstract brand art panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-secondary relative overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        {/* Brand logo & tagline */}
        <div className="relative z-10 px-16 text-center">
          <h1 className="font-display text-5xl font-medium tracking-tight text-primary">
            Divyam
          </h1>
          <p className="mt-4 text-lg text-foreground-inverse/60">
            Premium Event Management, Reimagined.
          </p>
        </div>
      </div>

      {/* Right — Auth form area */}
      <div className="flex w-full items-center justify-center bg-bg-base px-6 lg:w-1/2">
        <div className="w-full max-w-105">{children}</div>
      </div>
    </div>
  );
}
