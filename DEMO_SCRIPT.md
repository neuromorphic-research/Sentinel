# Sentinel — 30-Second Demo Video Script

**Goal:** In 30 seconds, make a viewer understand and believe that Sentinel kills false alarms, runs on the edge (no cloud), and explains every alert in plain language.

**Tone:** Calm, confident, control-room. Let the product breathe — don't rush the verdict moment.

**Setup before recording:** Run `npm run dev`, open `http://localhost:3000` full-screen on a dark display. Start on **Live Operations** with the Demo Mode tile already auto-playing.

---

## The 60-word voiceover (read slowly, ~30s)

> "Most security cameras cry wolf — up to 99% of their alarms are false.
> **Sentinel** is different. A fast detector watches every camera, and when something moves, an on-device AI decides if it's a *real* threat — and writes the reason.
> A fox? Suppressed on the camera. A person on the fence? Verified, explained, and escalated in about a second.
> No cloud. Nothing leaves the device. Just answers."

---

## Beat-by-beat (time · on screen · what to say)

| Time | On screen | Voiceover |
|------|-----------|-----------|
| **0:00–0:05** | **Live Operations** home — camera wall of night feeds, KPI counters, "On-device · No cloud" badge. | "Most security cameras cry wolf — up to 99% of their alarms are false." |
| **0:05–0:09** | Demo Mode tile: a fox triggers **Spike**, **Talon** dismisses it → the **"False alarms suppressed"** counter ticks up green. | "Sentinel is different — when something moves, an on-device AI decides if it's a real threat." |
| **0:09–0:16** | Same tile flips to a **person on the fence**: detection box → "Talon verifying…" → red **VERIFIED** verdict card with the plain-language reason + 96% confidence. | "A fox? Suppressed on the camera. A person on the fence? Verified, explained…" |
| **0:16–0:22** | Click the verdict → **Event Detail**: read the verdict line, show the **Spike → Talon → Action** cascade with millisecond timings. | "…and escalated in about a second — with a written reason a guard could act on." |
| **0:22–0:27** | Jump to **Site / Fleet Map**: pan the remote sites glowing **"Edge online · Cloud N/A."** | "Everything runs on the camera itself. No cloud — it even works on disconnected sites." |
| **0:27–0:30** | Cut to **Analytics**: the before/after chart (685/day → 9/day) and the savings figure. | "From hundreds of false alarms a day, down to a handful that matter." |

---

## What to emphasize (the four "wow" beats)

1. **The suppressed false alarm** — the green counter ticking up is the core value, made visible. Pause on it.
2. **The plain-language verdict** — read it aloud; it sounds like a competent guard wrote it.
3. **The cascade timing** — "Spike ~36ms, Talon ~1.2s" makes "edge" tangible.
4. **Cloud N/A on a remote site** — drives home on-device / offline-capable.

## One-liner if you only get 10 seconds

> "Sentinel turns any camera into a guard that verifies its own alarms — on the device, with a plain-language reason, and no cloud."

## Optional spoken close (CTA)

> "Sentinel — the guard that explains itself."

---

### Filming tips
- Record at 1920×1080, hide the OS cursor where possible, and let each animation finish.
- The Demo Mode lifecycle loops on its own, so you can time your narration to it rather than clicking.
- If you click into Event Detail or the Map, give the route-transition fade a beat to land before talking.
