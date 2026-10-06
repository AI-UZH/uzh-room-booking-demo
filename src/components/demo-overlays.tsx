"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { DemoGuide } from "@/components/demo-guide";
import { FeedbackDrawer } from "@/components/feedback-widget";

const GUIDE_SEEN_KEY = "uzh-rooms-demo-guide-seen";
export const OPEN_GUIDE_EVENT = "uzh-rooms:open-guide";
export const OPEN_FEEDBACK_EVENT = "uzh-rooms:open-feedback";

/** Lets any component (e.g. the header) open the guide without prop drilling. */
export function openDemoGuide() {
  window.dispatchEvent(new Event(OPEN_GUIDE_EVENT));
}

/** Floating feedback tab plus the first-visit demo guide, mounted once in the root layout. */
export function DemoOverlays({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const [guideOpen, setGuideOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const markGuideSeen = useCallback(() => {
    try {
      localStorage.setItem(GUIDE_SEEN_KEY, "1");
    } catch {
      // storage unavailable — the guide just shows again next visit
    }
  }, []);

  const changeGuideOpen = useCallback(
    (open: boolean) => {
      setGuideOpen(open);
      if (!open) markGuideSeen();
    },
    [markGuideSeen],
  );

  useEffect(() => {
    const openGuide = () => setGuideOpen(true);
    const openFeedback = () => setFeedbackOpen(true);
    window.addEventListener(OPEN_GUIDE_EVENT, openGuide);
    window.addEventListener(OPEN_FEEDBACK_EVENT, openFeedback);
    return () => {
      window.removeEventListener(OPEN_GUIDE_EVENT, openGuide);
      window.removeEventListener(OPEN_FEEDBACK_EVENT, openFeedback);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    let seen = false;
    try {
      seen = localStorage.getItem(GUIDE_SEEN_KEY) === "1";
    } catch {
      // treat as not seen
    }
    if (seen) return;
    const timer = setTimeout(() => setGuideOpen(true), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setFeedbackOpen(true)}
        aria-label="Give feedback"
        className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2 rounded-l-xl bg-[var(--uzh-blue)] px-2.5 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:pr-4 hover:bg-[var(--uzh-blue)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)] focus-visible:ring-offset-2 [writing-mode:vertical-rl]"
      >
        <MessageSquare className="size-4" />
        <span>Feedback</span>
      </button>

      <DemoGuide
        open={guideOpen}
        onOpenChange={changeGuideOpen}
        onOpenFeedback={() => setFeedbackOpen(true)}
      />
      <FeedbackDrawer
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        isSuperAdmin={isSuperAdmin}
        onOpenGuide={() => setGuideOpen(true)}
      />
    </>
  );
}
