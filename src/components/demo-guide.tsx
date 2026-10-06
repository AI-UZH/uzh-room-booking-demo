"use client";

import type { ReactNode } from "react";
import { Check, MessageSquare, Sparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const WORKS: ReactNode[] = [
  <>
    <strong>Find a room</strong> — browse 120+ real UZH rooms with photos, 360° views and Uniability
    accessibility data. Filter by type, location, accessibility and a capacity range; sort by
    capacity; switch between grid and list.
  </>,
  <>
    <strong>Create an account</strong> — sign-up with email confirmation really works. Or skip it and
    use <em>Demo access</em> to try every role (member, approver, admin, super admin).
  </>,
  <>
    <strong>Book a room</strong> — see live availability, book instantly or send a request for
    approval, from the calendar or straight from a room. Optionally fill in the full event request
    (mirrors Campus Culture&apos;s form).
  </>,
  <>
    <strong>Get the confirmation</strong> — an email with every detail you entered, plus a calendar
    invite (.ics) that opens in Outlook, Google Calendar and Apple Calendar.
  </>,
  <>
    <strong>Manage it</strong> — edit or cancel under <em>My bookings</em>; approvers and admins have
    a dashboard to decide on requests and manage rooms.
  </>,
];

const SIMULATED: { title: string; why: string }[] = [
  {
    title: "Sign in with your UZH Microsoft account",
    why: "Needs an integration and sign-off from UZH IT. The demo uses email + password instead.",
  },
  {
    title: "Real room schedules",
    why: "Bookings live only in this demo's own database. Nothing reaches the real UZH room system or anyone's actual calendar.",
  },
  {
    title: "Billing, equipment orders, recurring series",
    why: "These would need real back-office systems — beyond what a quick showcase should pretend to do.",
  },
  {
    title: "Calendar that updates itself",
    why: "Each email carries a fresh calendar file; there's no live two-way sync with your calendar.",
  },
  {
    title: "Permanence",
    why: "Data can be reset at any time, and emails come from a demo test sender (check your spam folder).",
  },
];

interface DemoGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenFeedback: () => void;
}

export function DemoGuide({ open, onOpenChange, onOpenFeedback }: DemoGuideProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto p-6 sm:max-w-2xl">
        <DialogHeader className="gap-2">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--uzh-blue)]/10 text-[var(--uzh-blue)]">
            <Sparkles className="size-5" />
          </span>
          <DialogTitle className="text-xl">Welcome to the UZH Rooms demo</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            A working prototype built in a short time <strong>with AI</strong>, to show what a modern
            room-booking experience for UZH could look like. It&apos;s here to <strong>inspire</strong>{" "}
            — it is not a real UZH system, and that&apos;s on purpose.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-[var(--uzh-green)]/40 bg-[var(--uzh-green)]/10 p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Check className="size-4 text-[color:oklch(0.45_0.15_128)]" />
              What really works
            </h3>
            <ul className="mt-2 flex flex-col gap-2.5 text-[13px] leading-relaxed text-foreground/85">
              {WORKS.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-secondary/40 p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Wrench className="size-4 text-muted-foreground" />
              Simulated or left out — and why
            </h3>
            <ul className="mt-2 flex flex-col gap-2.5 text-[13px] leading-relaxed text-foreground/85">
              {SIMULATED.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}.</strong> {item.why}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-[var(--uzh-blue)] p-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-snug">
            <strong>Missing something, or have an idea?</strong>
            <br />
            <span className="text-white/80">
              Use the <em>Feedback</em> tab on the right edge of any page — no login needed.
            </span>
          </p>
          <Button
            variant="secondary"
            className="shrink-0 gap-1.5"
            onClick={() => {
              onOpenChange(false);
              onOpenFeedback();
            }}
          >
            <MessageSquare className="size-4" />
            Leave feedback
          </Button>
        </div>

        <Button
          className="w-full bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
          onClick={() => onOpenChange(false)}
        >
          Got it — let me explore
        </Button>
      </DialogContent>
    </Dialog>
  );
}
