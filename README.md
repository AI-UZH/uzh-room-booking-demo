# UZH Room Booking Showcase

A single-page proof-of-concept for a modern, unified room booking experience for the
University of Zurich — combining event room discovery, accessibility information (in the
spirit of [Uniability](https://www.uniability.uzh.ch/de.html)), and a frictionless one-click
booking flow, as a showcase for replacing the legacy 3vrooms interface.

This is a **non-official demo** built with mock data. It is not affiliated with or endorsed
by UZH IT Services.

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

- **Room discovery** — filterable grid of UZH event rooms (capacity, location, search)
- **Room detail view** — photo, 3D-visual placeholder, Uniability-style accessibility
  indicators (wheelchair access, wheelchair WC, stair lifts, wheelchair parking, hearing
  loops), and amenities (seating style, projector, whiteboard, video conferencing)
- **Booking flow** — date + time-slot picker, plus a one-click "Schnellbuchung" that skips
  approval steps and confirms instantly with a success toast and confetti

## Data & image credits

Room names, capacities and locations are adapted from
[Campus Culture UZH — Eventräume](https://www.campuskultur.uzh.ch/en/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume.html).
The UZH logo and the KOL Lichthof photo are sourced directly from Campus Culture UZH.
The remaining room photos are academic-space stand-ins from Wikimedia Commons (CC-licensed),
used because the source site only exposes 360° panorama viewers rather than static photos —
see the `imageCredit` field on each room in `src/lib/rooms.ts` for attribution.

## Deploying

Deploy to [Vercel](https://vercel.com/new) by importing this GitHub repository — no
environment variables or backend services are required.
