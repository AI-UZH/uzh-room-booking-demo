"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const VISITOR_ID_KEY = "uzh-rooms-visitor-id";

interface Stats {
  visitors: number;
  bookings: number;
}

function getOrCreateVisitorId(): string | undefined {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    // storage blocked — still show the totals, just don't count this visit
    return undefined;
  }
}

/**
 * Small, deliberately unobtrusive counters for the hero banner. Visitors are
 * counted anonymously by a random ID kept in this browser — see
 * 20260916000019_site_stats.sql.
 */
export function SiteStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .rpc("record_visit", { p_visitor_id: getOrCreateVisitorId() })
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setStats(data as unknown as Stats);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) return null;

  return (
    <p
      className="mt-6 flex items-center justify-end gap-x-4 text-[11px] text-white/55"
      title="Unique visitors are counted anonymously using a random ID stored in your browser — no personal data."
    >
      <span className="inline-flex items-center gap-1">
        <Users className="size-3" aria-hidden="true" />
        {stats.visitors.toLocaleString("en-GB")} {stats.visitors === 1 ? "visitor" : "visitors"}
      </span>
      <span className="inline-flex items-center gap-1">
        <CalendarCheck className="size-3" aria-hidden="true" />
        {stats.bookings.toLocaleString("en-GB")} {stats.bookings === 1 ? "room booked" : "rooms booked"}
      </span>
    </p>
  );
}
