"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import apiClient from "@/core/lib/api";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Determine a basic session ID stored in localStorage to prevent tracking the same user multiple times
    let sessionId = localStorage.getItem("divyam_session_id");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem("divyam_session_id", sessionId);
    }

    const trackVisit = async () => {
      try {
        await apiClient.post("/visitors/track", {
          sessionId,
          path: pathname,
        });
      } catch (error) {
        // Silently fail, it's just analytics
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
