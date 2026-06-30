// Shared dark chart palette for the Analytics / ROI screen.
// Mirrors the Tailwind design tokens so recharts matches the control-room theme.
export const CHART = {
  accent: "#22D3EE",
  accentSoft: "#0E7490",
  threat: "#F2495C",
  safe: "#3BB273",
  pending: "#F5A524",
  grid: "#23272F",
  axis: "#A6ADBB",
  ink: "#E7EAF0",
  inkFaint: "#6B7280",
} as const;

// Color per dismissal reason key, kept within the token palette.
export const DISMISSAL_COLORS: Record<string, string> = {
  wildlife: CHART.safe,
  weather: CHART.accent,
  headlights: CHART.pending,
  vegetation: CHART.accentSoft,
  authorized: CHART.inkFaint,
};

export const AXIS_TICK = {
  fill: CHART.axis,
  fontSize: 11,
  fontFamily: "var(--font-mono), ui-monospace, monospace",
} as const;
