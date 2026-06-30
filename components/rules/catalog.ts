import type { ActionKind } from "@/lib/types";
import { ACTION_LABELS } from "@/lib/status";

// ── The local "draft" the composer wires together ───────────────────────────
// Pure client state. Nothing here is ever evaluated — it only feeds string
// templating for the faux preview.
export interface RuleDraft {
  text: string;
  zone: string;
  schedule: string;
  objects: string[];
  actions: ActionKind[];
  ignore: string[];
}

export interface ChipOption {
  value: string;
  label: string;
}

// ── Catalogs for each "node" the operator can wire ──────────────────────────
export const ZONE_OPTIONS: ChipOption[] = [
  { value: "Restricted perimeter", label: "Restricted perimeter" },
  { value: "Restricted yard", label: "Restricted yard" },
  { value: "Equipment bays", label: "Equipment bays" },
  { value: "Control cabinets", label: "Control cabinets" },
  { value: "Fence tripwire", label: "Fence tripwire" },
  { value: "Loading dock", label: "Loading dock" },
];

export const SCHEDULE_OPTIONS: ChipOption[] = [
  { value: "All hours", label: "All hours" },
  { value: "19:00 – 06:00", label: "After hours · 19:00–06:00" },
  { value: "20:00 – 05:00", label: "Night · 20:00–05:00" },
  { value: "08:00 – 18:00", label: "Daytime · 08:00–18:00" },
  { value: "Weekends", label: "Weekends only" },
];

export const OBJECT_OPTIONS: ChipOption[] = [
  { value: "person", label: "Person" },
  { value: "vehicle", label: "Vehicle" },
  { value: "package", label: "Package" },
  { value: "ladder/tool", label: "Ladder / tool" },
  { value: "bag", label: "Bag" },
];

export const IGNORE_OPTIONS: ChipOption[] = [
  { value: "animal", label: "Animals" },
  { value: "weather", label: "Weather" },
  { value: "vegetation", label: "Vegetation" },
  { value: "headlights", label: "Headlights" },
  { value: "authorized-staff", label: "Authorized staff" },
  { value: "service-vehicle", label: "Service vehicles" },
];

export const ACTION_OPTIONS: { value: ActionKind; label: string }[] = (
  Object.keys(ACTION_LABELS) as ActionKind[]
).map((kind) => ({ value: kind, label: ACTION_LABELS[kind] }));

// ── Plain-English templating (NO evaluation, pure string assembly) ──────────

/** Join a list into prose: ["a","b","c"] → "a, b, and c". */
function joinProse(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function objectLabel(value: string): string {
  return OBJECT_OPTIONS.find((o) => o.value === value)?.label.toLowerCase() ?? value;
}

function ignoreLabel(value: string): string {
  return IGNORE_OPTIONS.find((o) => o.value === value)?.label.toLowerCase() ?? value;
}

function scheduleClause(schedule: string): string {
  if (!schedule || schedule === "All hours") return "at any hour";
  if (schedule === "Weekends") return "on weekends";
  return `between ${schedule}`;
}

/** The headline sentence: what this rule would alert on. */
export function buildTriggerSentence(draft: RuleDraft): string {
  const objects =
    draft.objects.length > 0
      ? joinProse(draft.objects.map(objectLabel))
      : "any tracked subject";
  const zone = draft.zone || "the monitored area";
  const verb = draft.objects.length === 1 && draft.objects[0] !== "person" ? "enters" : "is detected in";
  return `This rule would alert when a ${objects} ${verb} ${zone} ${scheduleClause(
    draft.schedule
  )}.`;
}

/** The suppression sentence: what Talon would dismiss on-device. */
export function buildSuppressSentence(draft: RuleDraft): string {
  if (draft.ignore.length === 0) {
    return "Nothing is excluded — every candidate is verified before it reaches a human.";
  }
  return `${capitalize(
    joinProse(draft.ignore.map(ignoreLabel))
  )} would be verified as non-threats and suppressed on-device — no alert raised.`;
}

/** The actions sentence: what fires on a verified hit. */
export function buildActionSentence(draft: RuleDraft): string {
  if (draft.actions.length === 0) {
    return "No response is wired yet — verified events would be logged only.";
  }
  const labels = draft.actions.map((a) => ACTION_LABELS[a]);
  return `On a verified hit, Sentinel would trigger ${joinProse(labels)}.`;
}

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
