import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/providers";
import { Toaster } from "sonner";
import { VisitorTracker } from "@/core/components/VisitorTracker";
import "./globals.css";

/* ─── Font Configuration ───────────────────────────────────────────── */

/** Display / Heading font — modern, geometric, clean. */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/** Body font — highly legible, technical precision. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/** Code / Mono font — used for IDs, tokens, data points. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

/* ─── Metadata ─────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: "Divyam — Premium Event Management",
    template: "%s | Divyam",
  },
  description:
    "Enterprise-grade event booking and management platform for modern businesses.",
  keywords: [
    "event management",
    "booking platform",
    "SaaS",
    "enterprise",
    "event booking",
  ],
};

/* ─── Root Layout ──────────────────────────────────────────────────── */

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-base text-foreground antialiased">
        <AppProviders>
          <VisitorTracker />
          {children}
          <Toaster theme="dark" position="top-right" />
        </AppProviders>
      </body>
    </html>
  );
}
