import type { ViewerRole } from "@/lib/roles";

export interface DemoAccount {
  role: ViewerRole;
  label: string;
  email: string | null;
  password: string | null;
  description: string;
}

/**
 * Every role this showcase demonstrates, "external" (signed out) included.
 * The four real accounts share one password on purpose — this is a public
 * demo, the point is letting anyone click through every permission tier in
 * seconds, not protecting anything. See [Header]'s "Demo access" menu.
 */
export const DEMO_PASSWORD = "DemoPassword123!";

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "external",
    label: "External visitor",
    email: null,
    password: null,
    description: "Browse room listings and content, but no live availability or booking — just a 'Contact us instead' form.",
  },
  {
    role: "member",
    label: "Member",
    email: "demo.member@uzh.ch",
    password: DEMO_PASSWORD,
    description: "The default role for anyone who signs up. Sees live availability and books rooms — instantly, or pending approval where required.",
  },
  {
    role: "approver",
    label: "Approver",
    email: "demo.approver@uzh.ch",
    password: DEMO_PASSWORD,
    description: "Everything a member can do, plus the bookings dashboard: approve, reject, or cancel any booking request.",
  },
  {
    role: "admin",
    label: "Admin",
    email: "demo.admin@uzh.ch",
    password: DEMO_PASSWORD,
    description: "Everything an approver can do, plus room management: create, edit, deactivate rooms, and reschedule any booking.",
  },
  {
    role: "super_admin",
    label: "Super Admin",
    email: "demo.super@uzh.ch",
    password: DEMO_PASSWORD,
    description: "Full access: everything an admin can do, plus changing anyone's role and permanently deleting rooms.",
  },
];
