import { create } from "zustand";

/**
 * Global UI Store (Zustand)
 *
 * Manages ephemeral client-side UI state that doesn't belong in the URL
 * or in React Query's cache. Examples: sidebar open/closed, command palette
 * visibility, and modal control.
 *
 * State that should be in the URL (filters, pagination) uses search params instead.
 */

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;

  // Mobile navigation
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // ─── Sidebar ────────────────────────────────────────────────────────
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  collapseSidebar: () => set({ isSidebarCollapsed: true }),
  expandSidebar: () => set({ isSidebarCollapsed: false }),

  // ─── Command Palette ───────────────────────────────────────────────
  isCommandPaletteOpen: false,
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((state) => ({
      isCommandPaletteOpen: !state.isCommandPaletteOpen,
    })),

  // ─── Mobile Navigation ─────────────────────────────────────────────
  isMobileNavOpen: false,
  toggleMobileNav: () =>
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
}));
