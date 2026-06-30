
# Sentinel — Demo Build Brief

> **For:** agentic front-end engineers
> **Goal:** Build a visually stunning, clickable **UI demo** of *Sentinel* — the self-verifying perimeter guard that runs on Neuromorphic's edge stack. **Front-end only, mocked data, no real ML/backend.** The demo must *tell the story* and *look like a premium product*, not be functional.

---

## 1. The one-liner

**Sentinel turns any perimeter camera into a guard that verifies its own alarms — on-device, no cloud.** A fast detector watches continuously; when something moves, an on-device vision-language model decides whether it's a *real* intrusion and explains why in plain language. Only verified, explained events reach a human.

---

## 2. What the demo must make a viewer feel

In 60 seconds, a viewer (a security director, an investor, a channel partner) should understand and believe:

1. **It kills false alarms.** 94–99% of traditional alarms are false; Sentinel only surfaces verified events with a written reason.
2. **It runs on the edge.** Everything happens *on the camera* (Axon). No cloud, works on disconnected/remote sites, footage never leaves.
3. **It explains itself.** Every alert has a plain-language verdict ("Person scaling perimeter fence, north yard — confirmed intrusion") and a confidence — not just a bounding box.
4. **It's effortless to configure.** Rules are written in plain English, no code (Synapse-style).
5. **It saves money.** Replaces guard hours, slashes false dispatches.

Design for a **live demo on a big screen** and a **scroll-through on a laptop**. Make it cinematic.

---

## 3. How it works (so engineers model the right UI states)

The product is a **two-stage on-device cascade**, mapped to Neuromorphic's existing building blocks. The UI should visibly reference this pipeline.

| Stage | Block | Role in the UI |
|------|-------|----------------|
| Always-on trigger | **Spike** (edge detector) | Continuously detects/tracks people & vehicles. In UI: live bounding boxes, "Spike: motion candidate" state. |
| Verification | **Talon** (on-device VLM) | Reasons "real intrusion or not?" and writes the reason. In UI: "Talon analyzing…" → verdict card with text + confidence. |
| Routing & rules | **Synapse Studio** | Plain-English rules; routes verified events to speaker/lights/VMS/SOC. In UI: rule builder + action chips. |
| Hardware | **Axon** (70 TOPS, IP65, PoE) | The edge device. In UI: device/health badges, "On-device · No cloud" indicator. |

**Event lifecycle to animate:** `Idle → Spike candidate detected → Talon verifying → Verdict (Verified intrusion / Dismissed: wildlife|weather|authorized) → Action taken (talk-down / notify SOC) → Logged`.

The two key emotional beats are (a) a *dismissed* event (fox / branch / headlights — "would've been a false alarm, suppressed on-device") and (b) a *verified* event (real intruder — alert + talk-down).

---

## 4. Tech for the demo

- **Stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS. Framer Motion for animation. lucide-react for icons. Recharts (or similar) for charts.
- **No backend.** All data from local mock JSON / TypeScript fixtures. Simulate "live" with timers/intervals and pre-recorded loops.
- **Video:** use looping placeholder clips or static frames with animated SVG overlays (bounding boxes, scan lines). No real inference. If no footage available, use stylized illustrations / generated stills of yards, fences, loading docks at night.
- **Responsive**, but optimize for **desktop / large display** first.
- Ship as a single deployable front-end (Vercel-style). Include a short seeded "demo mode" that auto-plays the event lifecycle.

---

## 5. Design language

Match and extend the Neuromorphic brand ("The visual cortex of robots" — technical, precise, premium, restrained).

- **Mood:** control-room meets high-end hardware product. Dark, calm, confident. Think a security operations console designed by a great product team.
- **Theme:** dark-first. Near-black background (`#0A0B0D`-ish), elevated panels in dark slate, hairline borders. A single **accent** color used sparingly for live/active/verified states (a cyan/electric-blue reads "neuromorphic"; pick one accent and use it deliberately).
- **Status colors:** verified/threat = red; dismissed/safe = muted green or neutral; analyzing/pending = accent/amber. Keep it sober — this is security, not a game.
- **Typography:** clean geometric/grotesque sans (e.g., Inter / Geist). Mono for telemetry, IDs, timestamps, confidence values, device specs.
- **Forbidden / avoid:** gradients-as-decoration, glossy 3D, emojis as UI, rainbow coloring, heavy drop shadows. Flat, structural, intentional.
- **Signature motifs:** an "on-device · no cloud" lockup badge; a subtle pipeline visual (Spike → Talon → Action) that recurs; scan-line / detection-box animation language; latency/confidence shown as crisp mono readouts.

---

## 6. Screens to build

Build these as a connected, clickable demo (sidebar or top-nav between them).

### 6.1 Live Operations (home / hero)
The money screen. A monitoring console.
- **Camera grid** (e.g., 2×3) of sites/cameras, each tile showing a still/loop with live Spike overlays and a small status chip (Idle / Candidate / Verifying / Verified / Dismissed).
- **Right rail: Verified Event Feed** — chronological cards; *only verified or noteworthy* events. Each card: thumbnail, site name, **plain-language verdict**, confidence %, time, and the action taken.
- **Top bar:** fleet status, "On-device · No cloud" badge, today's counts (Candidates seen / False alarms suppressed / Verified events / Guard-hours saved).
- **Hero animation:** one tile runs the full lifecycle on a loop so the screen feels alive.

### 6.2 Event Detail (the "explainability" wow)
Opens when a feed card is clicked.
- Large clip/frame with the detection box and a timeline scrubber marking `Spike trigger → Talon verdict`.
- **Talon verdict panel:** the written reasoning in plain language, a confidence meter, the rule that matched, and the dismissal/verification label.
- **Cascade trace:** visual "Spike detected person (38ms) → Talon verified intrusion (1.2s) → Talk-down triggered" with mono timings.
- **Actions taken** list + manual override buttons (Escalate to police / Dismiss / Add to BOLO) — visual only.

### 6.3 Single Camera / Live View
- Full-bleed feed with toggleable overlays: Spike boxes, zones, tripwires.
- Side panel: this camera's active rules, recent events, device health (model: Axon, temp, PoE, storage, **edge inference latency**), and the unmissable **"100% on-device — this footage never left the camera"** statement.

### 6.4 Rule Builder (Synapse-style, plain English)
- A no-code rule composer: natural-language rule input ("Alert on a person in the yard after 19:00; ignore animals and weather") plus structured chips (zone, schedule, object, action).
- Show a couple of pre-built rules as cards. A live "preview" panel that *says* what would trigger. **No real evaluation needed** — fake the preview.
- Reinforce the analogy: building a perception rule like wiring nodes — keep it elegant and simple.

### 6.5 Site / Fleet Map
- Map with site markers across regions; emphasize **remote, low-connectivity sites** (substation, construction yard, depot) each showing **"Edge online · Cloud N/A"** to dramatize the offline-capable story.
- Click a site → its cameras + status. Reinforce "scales to hundreds of sites without proportional staff."

### 6.6 Analytics / ROI
- Clean dashboard: **False alarms suppressed over time**, **alarms reaching a human (before vs after)**, **guard-hours saved**, **verified incidents**. Use the kind of numbers from the business case (e.g., legacy ~685 alarms/day → <10/day; guard rotation $32k/mo → far less). Label everything; mock but believable.

### 6.7 Device / Edge Status (optional but strong)
- A hardware-flavored page showing the Axon unit, specs (70 TOPS, 8GB, IP65, −20 to +65°C, PoE), live edge telemetry, and "no data egress" emphasis. Sells the integrated HW+SW story.

---

## 7. Key reusable components
- `StatusChip` (Idle / Candidate / Verifying / Verified / Dismissed)
- `VerdictCard` (thumbnail + plain-language reason + confidence + action)
- `CascadeTrace` (Spike → Talon → Action with mono timings)
- `DetectionOverlay` (animated SVG boxes / scan lines over a frame)
- `OnDeviceBadge` ("On-device · No cloud")
- `ConfidenceMeter`, `MetricStat`, `RulePill`, `DeviceHealthPanel`
- `EventFeed`, `CameraGrid`, `SiteMap`

---

## 8. Mock data to seed
Create a `mock/` fixtures set:
- **6–10 cameras** across **4–5 sites** (e.g., "North Substation", "Riverside Construction", "DC-2 Loading Dock", "Equipment Yard B").
- **~20 events** mixing verified intrusions and dismissed non-events. For each: id, site, camera, timestamp, stage, Spike latency, Talon latency, verdict text, confidence, matched rule, action taken, thumbnail ref.
- Dismissal reasons to include: *fox / deer*, *tree branch in wind*, *vehicle headlights*, *authorized staff (badge match)*, *heavy rain*.
- Verification examples: *person scaling fence*, *loitering at gate after hours*, *vehicle entering restricted zone*, *tampering with cabinet*.
- A few **rules** and **ROI time-series** numbers for the analytics page.

Write the verdict copy carefully — it's the product's voice. Keep it factual and specific, e.g.:
> "Single person climbing perimeter fence at North Substation, east line. Movement consistent with deliberate entry. Confidence 96%. Matched rule: 'After-hours intrusion — restricted zone'."
> "Motion dismissed: animal (likely fox) crossing yard. No human form detected. Suppressed on-device — no alert raised."

---

## 9. The "wow" moments — get these right
1. **The suppressed false alarm.** Show a fox trigger Spike, Talon dismiss it, and a counter tick up: "False alarm suppressed on-device." This is the core value, made visible.
2. **The plain-language verdict.** Reads like a competent guard wrote it, in ~1 second.
3. **The on-device / offline badge** everywhere it matters — especially on a remote site with "Cloud N/A".
4. **The cascade timing readout** (Spike ~tens of ms, Talon ~1s) — makes "edge" tangible.

---

## 10. Out of scope (explicitly)
- No real detection, no real VLM, no inference, no backend, no auth, no real video pipeline, no device integration. **Pure front-end demo with mocked, scripted data.** Anything "live" is simulated with timers and fixtures.

---

## 11. Definition of done
- All screens in §6 build and navigate; dark, premium, on-brand; responsive on desktop.
- "Demo mode" auto-plays the event lifecycle on the Live Operations screen (idle → candidate → verifying → verdict → action), including at least one *suppressed* and one *verified* event.
- Event Detail shows the explainability panel + cascade trace.
- Rule Builder, Site Map (with offline sites), and Analytics are populated from mock data and look real.
- Zero console errors; deployable as a static/SSR front-end.


