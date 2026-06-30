# Sentinel — Demo

> **Sentinel turns any perimeter camera into a guard that verifies its own alarms — on-device, no cloud.**

A visually rich, **front-end-only** product demo of *Sentinel*, the self-verifying perimeter guard built on Neuromorphic's edge stack. A fast detector (**Spike**) watches continuously; when something moves, an on-device vision-language model (**Talon**) decides whether it's a *real* intrusion and explains why in plain language. Only verified, explained events reach a human.

**This is a demo.** There is no real ML, no inference, and no backend — everything is mocked with TypeScript fixtures and simulated with timers. See [`aim.md`](./aim.md) for the full build brief.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript** (strict)
- **Tailwind CSS v3** — dark control-room design system
- **Framer Motion** — lifecycle / UI animation
- **lucide-react** — icons
- **Recharts** — analytics charts

## Getting started

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (defaults to `http://localhost:3000`).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # next lint
```

## Screens

| Route | Screen | What it shows |
|-------|--------|---------------|
| `/` | **Live Operations** | Monitoring console: camera grid, verified event feed, auto-playing demo-mode lifecycle |
| `/events` · `/events/[id]` | **Event Detail** | The explainability "wow": Talon verdict, confidence, cascade trace, override actions |
| `/camera` · `/camera/[id]` | **Single Camera** | Full-bleed live view, toggleable overlays, device health, "footage never left the camera" |
| `/rules` | **Rule Builder** | No-code, plain-English rule composer with a faked live preview |
| `/map` | **Site / Fleet Map** | Regional map dramatizing remote, offline ("Cloud N/A") sites |
| `/analytics` | **Analytics / ROI** | False alarms suppressed, before/after, guard-hours saved, cost savings |
| `/device` | **Device / Edge** | The Axon hardware unit, specs, live edge telemetry, "no data egress" |

## Project structure

```
app/                 # App Router routes (one folder per screen)
components/
  shell/             # Sidebar, Topbar, PageContainer/PageHeader
  ui/                # StatusChip, OnDeviceBadge, MetricStat, ConfidenceMeter, RulePill
  scene/             # SceneFrame (faux night camera still) + DetectionOverlay
  cascade/           # CascadeTrace (Spike → Talon → Action)
  feed/              # VerdictCard, EventFeed
  camera/            # CameraTile, CameraGrid
  device/            # DeviceHealthPanel
  …                  # screen-specific components live in their own folders
lib/                 # types, utils, status maps, nav config
mock/                # all fixture data (sites, cameras, events, rules, ROI)
```

## Design language

Dark-first, near-black (`#0A0B0D`) surfaces with hairline borders and a single electric-cyan accent used sparingly for live/active states. Status colors: **red** = verified threat, **green** = dismissed/safe, **amber** = analyzing. Mono type for all telemetry, IDs, timestamps, confidence, and device specs. Flat, structural, premium — control-room meets high-end hardware.

## Mocked data

All data lives in `mock/` and is fully typed by `lib/types.ts`: ~9 cameras across 5 sites, ~22 events (verified intrusions + suppressed non-events), rules, and ROI time series. Anything "live" (counters, the lifecycle animation, telemetry jitter) is simulated client-side with timers.
