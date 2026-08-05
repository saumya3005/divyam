import { useEffect } from "react";

/**
 * useKeyboardShortcut
 *
 * Registers a global keyboard shortcut.
 * Supports modifier keys (Cmd/Ctrl + key) and ignores shortcuts
 * when the user is typing in an input field.
 *
 * @example
 * useKeyboardShortcut("k", () => openCommandPalette(), { meta: true });
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { meta?: boolean; shift?: boolean; ctrl?: boolean } = {}
): void {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Ignore shortcuts when user is typing
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const metaMatch = options.meta ? event.metaKey || event.ctrlKey : true;
      const shiftMatch = options.shift ? event.shiftKey : true;
      const ctrlMatch = options.ctrl ? event.ctrlKey : true;

      if (event.key.toLowerCase() === key.toLowerCase() && metaMatch && shiftMatch && ctrlMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, options]);
}
