// ── Core domain types for the Sentinel demo ──────────────────────────────────
// All data is mocked. These types are the shared contract across every screen.

export type EventStage =
  | "idle"
  | "candidate"
  | "verifying"
  | "verified"
  | "dismissed";

export type StatusKind = EventStage; // alias used by StatusChip

export type DismissalReason =
  | "wildlife"
  | "weather"
  | "vegetation"
  | "headlights"
  | "authorized";

export type VerificationKind =
  | "fence-climb"
  | "loitering"
  | "vehicle-restricted"
  | "tampering"
  | "perimeter-breach";

export type ActionKind =
  | "talk-down"
  | "notify-soc"
  | "dispatch"
  | "lights"
  | "log-only"
  | "siren";

export interface Action {
  kind: ActionKind;
  label: string;
  /** ISO-ish display time, e.g. "02:14:07" */
  at: string;
}

export interface Site {
  id: string;
  name: string;
  region: string;
  /** normalized 0..1 map coordinates for the SiteMap */
  x: number;
  y: number;
  connectivity: "edge-online" | "cloud-na" | "degraded";
  cameraIds: string[];
  notes?: string;
}

export interface Camera {
  id: string;
  name: string;
  siteId: string;
  /** short scene descriptor used by the faux frame renderer */
  scene:
    | "fence-night"
    | "yard-night"
    | "loading-dock"
    | "substation"
    | "gate"
    | "equipment-yard"
    | "perimeter";
  stage: EventStage;
  device: DeviceHealth;
}

export interface DeviceHealth {
  model: string; // "Axon X1"
  tops: number; // 70
  tempC: number;
  poe: boolean;
  storagePct: number;
  /** edge inference latency in ms (Spike) */
  latencyMs: number;
  uptimeDays: number;
}

export interface SentinelEvent {
  id: string;
  siteId: string;
  cameraId: string;
  /** display timestamp, e.g. "02:14:03" */
  timestamp: string;
  /** epoch-ish ordering value */
  order: number;
  stage: Extract<EventStage, "verified" | "dismissed">;
  spikeLatencyMs: number; // tens of ms
  talonLatencyMs: number; // ~hundreds to ~1500 ms
  /** plain-language Talon verdict — the product's voice */
  verdict: string;
  confidence: number; // 0..100
  matchedRule?: string;
  verificationKind?: VerificationKind;
  dismissalReason?: DismissalReason;
  actions: Action[];
  thumbnail: string; // scene key reused as a ref
}

export interface Rule {
  id: string;
  name: string;
  /** the natural-language sentence shown in the builder */
  text: string;
  enabled: boolean;
  zone: string;
  schedule: string;
  objects: string[];
  ignore: string[];
  actions: ActionKind[];
  triggeredCount: number;
}

export interface RoiPoint {
  label: string; // day or month label
  legacyAlarms: number;
  sentinelAlarms: number;
  suppressed: number;
  verified: number;
}

export interface FleetStat {
  candidatesSeen: number;
  falseAlarmsSuppressed: number;
  verifiedEvents: number;
  guardHoursSaved: number;
}
