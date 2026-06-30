import type { RoiPoint, FleetStat } from "@/lib/types";

// 14-day trend. Legacy systems flood operators; Sentinel surfaces only verified.
export const roiSeries: RoiPoint[] = [
  { label: "Jun 17", legacyAlarms: 671, sentinelAlarms: 11, suppressed: 660, verified: 11 },
  { label: "Jun 18", legacyAlarms: 698, sentinelAlarms: 9, suppressed: 689, verified: 9 },
  { label: "Jun 19", legacyAlarms: 642, sentinelAlarms: 8, suppressed: 634, verified: 8 },
  { label: "Jun 20", legacyAlarms: 710, sentinelAlarms: 12, suppressed: 698, verified: 12 },
  { label: "Jun 21", legacyAlarms: 688, sentinelAlarms: 7, suppressed: 681, verified: 7 },
  { label: "Jun 22", legacyAlarms: 655, sentinelAlarms: 6, suppressed: 649, verified: 6 },
  { label: "Jun 23", legacyAlarms: 702, sentinelAlarms: 10, suppressed: 692, verified: 10 },
  { label: "Jun 24", legacyAlarms: 681, sentinelAlarms: 9, suppressed: 672, verified: 9 },
  { label: "Jun 25", legacyAlarms: 667, sentinelAlarms: 8, suppressed: 659, verified: 8 },
  { label: "Jun 26", legacyAlarms: 725, sentinelAlarms: 13, suppressed: 712, verified: 13 },
  { label: "Jun 27", legacyAlarms: 690, sentinelAlarms: 7, suppressed: 683, verified: 7 },
  { label: "Jun 28", legacyAlarms: 648, sentinelAlarms: 5, suppressed: 643, verified: 5 },
  { label: "Jun 29", legacyAlarms: 705, sentinelAlarms: 11, suppressed: 694, verified: 11 },
  { label: "Jun 30", legacyAlarms: 685, sentinelAlarms: 9, suppressed: 676, verified: 9 },
];

// Today's running fleet stats (top bar on Live Operations).
export const fleetStat: FleetStat = {
  candidatesSeen: 4218,
  falseAlarmsSuppressed: 676,
  verifiedEvents: 9,
  guardHoursSaved: 184,
};

// Headline ROI figures for the analytics page.
export const roiHeadline = {
  legacyAlarmsPerDay: 685,
  sentinelAlarmsPerDay: 9,
  reductionPct: 98.7,
  guardRotationCostMonthly: 32000,
  sentinelCostMonthly: 7400,
  monthlySavings: 24600,
  falseDispatchesAvoidedMonthly: 142,
  sitesMonitored: 5,
  camerasOnline: 9,
};

// Dismissal reason breakdown for a donut/bar.
export const dismissalBreakdown = [
  { reason: "Wildlife", count: 287, key: "wildlife" },
  { reason: "Weather", count: 173, key: "weather" },
  { reason: "Headlights", count: 121, key: "headlights" },
  { reason: "Vegetation", count: 64, key: "vegetation" },
  { reason: "Authorized staff", count: 31, key: "authorized" },
];
