/**
 * Design Token Constants
 *
 * These mirror the CSS variables defined in globals.css for use in JS-only
 * contexts (e.g., GSAP animations, chart configurations, canvas drawing).
 * For component styling, ALWAYS prefer Tailwind classes / CSS variables.
 */

export const COLORS = {
  // Primary
  champagneGold: "#D4AF37",
  deepForest: "#1A2421",
  graphite: "#2B2B2B",

  // Secondary
  olive: "#556B2F",
  copper: "#B87333",

  // Light Mode Surfaces
  warmCream: "#F9F6F0",
  alabaster: "#FFFFFF",
  stoneGrey: "#EFEBE3",

  // Dark Mode Surfaces
  charcoal: "#121212",
  obsidian: "#1E1E1E",
  deepSlate: "#252525",

  // Borders
  borderLight: "#E0DCD3",
  borderDark: "#333333",

  // Semantic
  success: "#2E8B57",
  warning: "#DAA520",
  danger: "#8B0000",
  info: "#4682B4",

  // Disabled
  disabledText: "#A9A9A9",
  disabledBg: "#EFEBE3",
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

export const LAYOUT = {
  sidebarExpanded: 280,
  sidebarCollapsed: 80,
  navbarHeight: 64,
  maxContentWidth: 1440,
} as const;

export const Z_INDEX = {
  base: 0,
  surface: 10,
  elevated: 20,
  overlay: 30,
  popup: 40,
  modal: 50,
  tooltip: 60,
  system: 70,
} as const;
