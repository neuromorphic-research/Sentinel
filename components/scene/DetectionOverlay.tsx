"use client";

import { cn } from "@/lib/utils";
import type { EventStage } from "@/lib/types";

interface Box {
  /** all values are percentages 0..100 of the frame */
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}

const TONE: Record<string, string> = {
  candidate: "var(--accent, #22D3EE)",
  verifying: "#F5A524",
  verified: "#F2495C",
  dismissed: "#3BB273",
  idle: "#6B7280",
};

/**
 * Live-feed scan overlay. A subtle top-to-bottom sweep tinted by stage while the
 * camera is actively detecting/verifying. Bounding boxes were intentionally
 * removed — they read as noisy squares over the photographic stills.
 *
 * The `boxes` prop is accepted for backwards compatibility but no longer drawn.
 */
export function DetectionOverlay({
  stage = "candidate",
  scan = true,
  className,
}: {
  stage?: EventStage;
  /** @deprecated no longer rendered */
  boxes?: Box[];
  scan?: boolean;
  className?: string;
}) {
  const color = TONE[stage] ?? TONE.candidate;
  const active = scan && (stage === "candidate" || stage === "verifying");

  if (!active) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute left-0 h-12 w-full animate-scan"
        style={{
          background: `linear-gradient(to bottom, transparent, ${color}22, transparent)`,
        }}
      />
    </div>
  );
}
