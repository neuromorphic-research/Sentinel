import type { EventStage, ActionKind, DismissalReason } from "./types";

export const STAGE_META: Record<
  EventStage,
  { label: string; tone: "neutral" | "accent" | "pending" | "threat" | "safe" }
> = {
  idle: { label: "Idle", tone: "neutral" },
  candidate: { label: "Candidate", tone: "accent" },
  verifying: { label: "Verifying", tone: "pending" },
  verified: { label: "Verified", tone: "threat" },
  dismissed: { label: "Dismissed", tone: "safe" },
};

export const TONE_CLASSES: Record<
  "neutral" | "accent" | "pending" | "threat" | "safe",
  { text: string; dot: string; ring: string; bg: string }
> = {
  neutral: {
    text: "text-ink-soft",
    dot: "bg-ink-faint",
    ring: "border-hairline-strong",
    bg: "bg-elevated",
  },
  accent: {
    text: "text-accent",
    dot: "bg-accent",
    ring: "border-accent/40",
    bg: "bg-accent/10",
  },
  pending: {
    text: "text-pending",
    dot: "bg-pending",
    ring: "border-pending/40",
    bg: "bg-pending/10",
  },
  threat: {
    text: "text-threat",
    dot: "bg-threat",
    ring: "border-threat/40",
    bg: "bg-threat/10",
  },
  safe: {
    text: "text-safe",
    dot: "bg-safe",
    ring: "border-safe/40",
    bg: "bg-safe/10",
  },
};

export const ACTION_LABELS: Record<ActionKind, string> = {
  "talk-down": "Talk-down",
  "notify-soc": "Notify SOC",
  dispatch: "Dispatch",
  lights: "Lights on",
  "log-only": "Logged",
  siren: "Siren",
};

export const DISMISSAL_LABELS: Record<DismissalReason, string> = {
  wildlife: "Wildlife",
  weather: "Weather",
  vegetation: "Vegetation",
  headlights: "Headlights",
  authorized: "Authorized staff",
};
