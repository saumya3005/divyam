import type { Variants, Transition } from "framer-motion";

// ─── Transition Presets ───────────────────────────────────────────────
// Mapped directly from the Phase 1 Motion Design System.

/** Fast start, slow finish — used when elements enter the viewport. */
export const easeDecelerate: Transition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
};

/** Slow start, fast finish — used when elements exit the viewport. */
export const easeAccelerate: Transition = {
  duration: 0.3,
  ease: [0.7, 0, 0.84, 0],
};

/** Playful spring — used for toggles, badges, and tactile feedback. */
export const springBounce: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

/** Gentle spring — used for layout animations and cards. */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/** Micro — used for hovers and tiny state changes. */
export const microTransition: Transition = {
  duration: 0.15,
  ease: [0.16, 1, 0.3, 1],
};

// ─── Variant Presets ──────────────────────────────────────────────────
// Reusable across all components via <motion.div variants={fadeInUp} />.

/** Fade in and slide up — the default page/section entrance. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeDecelerate,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: easeAccelerate,
  },
};

/** Fade in — used for overlays, backdrops, and subtle transitions. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/** Scale up — used for modals and dialogs. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easeDecelerate,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: easeAccelerate,
  },
};

/** Slide in from right — used for drawers and side panels. */
export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: easeDecelerate,
  },
  exit: {
    x: "100%",
    transition: easeAccelerate,
  },
};

/** Slide in from left — used for sidebars on mobile. */
export const slideInLeft: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: easeDecelerate,
  },
  exit: {
    x: "-100%",
    transition: easeAccelerate,
  },
};

/** Slide down — used for dropdown menus and notification panels. */
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -8, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: easeDecelerate,
  },
  exit: {
    opacity: 0,
    y: -8,
    height: 0,
    transition: easeAccelerate,
  },
};

/** Stagger children — parent variant for staggered list entrances. */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

/** Stagger item — child variant paired with staggerContainer. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeDecelerate,
  },
};

// ─── Hover Presets ────────────────────────────────────────────────────

/** Card lift effect on hover — translateY + shadow deepening. */
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: springGentle,
  },
};

/** Subtle button press down on tap. */
export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 },
};
