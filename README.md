# UZH Room Booking Showcase

A single-page proof-of-concept for a modern, unified room booking experience for the
University of Zurich — combining event room discovery, real accessibility data (from
[Uniability](https://www.uniability.uzh.ch/de.html)), live 360° room visuals, and a
frictionless one-click booking flow, as a showcase for replacing the legacy 3vrooms interface.
Built by [UZH.ai](https://github.com/AI-UZH) to inspire fellow UZH colleagues.

This is a **non-official demo**. It is not affiliated with or endorsed by UZH IT Services.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS, styled with UZH's corporate colors and Source Sans 3
- [shadcn/ui](https://ui.shadcn.com) components + [Lucide](https://lucide.dev) icons
- Hardcoded mock data (`src/lib/rooms.ts`) — zero backend, zero latency

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's here

- **Room discovery** — filterable grid of all 26 UZH event rooms listed on del.uzh.ch
  (search, location, capacity buckets, exact attendee count, "available now")
- **Calendar view** — a day schedule across every room, click an open slot to start booking it
- **Room detail view** — real room photo, a live embedded 360° room viewer ("View 3D Room
  Visual"), and Uniability-sourced accessibility data: step-free access, hearing loop, door
  width, reserved wheelchair seats, plus an expandable full raw report
- **Booking flow** — date + time-slot picker, plus a one-click "Schnellbuchung" that skips
  approval steps and confirms instantly with a success toast and confetti
- **Three views, one profile menu** — switch between an external visitor (accessibility info
  only, prompted to log in to book), a logged-in UZH member (full booking), and a facilities
  administrator (adds a bookings dashboard with approve/cancel and stat tiles)

## Data & image credits

Room list, 360° viewer embeds and building locations come from
[del.uzh.ch — Eventräume](https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume.html).
Accessibility data, capacities and most room photos come from
[Uniability](https://www.uniability.uzh.ch/de.html)'s per-room pages, which cover 17 of the
26 rooms (the rest — Lichthofs, the Mensa, BIN Mall, courtyards, and a few combined rooms —
aren't catalogued there individually). For those, and where a Uniability photo wasn't
available, the app falls back to the real Campus Culture UZH Lichthof photo or CC-licensed
academic-space stand-ins from Wikimedia Commons — see each room's `imageCredit` and
`accessibility.notes` field in `src/lib/rooms.ts` for exactly which is which.

## Deploying

Deploy to [Vercel](https://vercel.com/new) by importing this GitHub repository — no
environment variables or backend services are required.
