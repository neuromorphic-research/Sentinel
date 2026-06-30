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
 * Animated SVG detection overlay — bounding boxes, corner ticks, scan sweep.
 * Pure CSS animations so it's cheap and loops forever.
 */
export function DetectionOverlay({
  stage = "candidate",
  boxes,
  scan = true,
  className,
}: {
  stage?: EventStage;
  boxes?: Box[];
  scan?: boolean;
  className?: string;
}) {
  const color = TONE[stage] ?? TONE.candidate;
  const list: Box[] =
    boxes ?? [{ x: 44, y: 40, w: 16, h: 42, label: stage }];

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {scan && (stage === "candidate" || stage === "verifying") && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute left-0 h-12 w-full animate-scan"
            style={{
              background: `linear-gradient(to bottom, transparent, ${color}22, transparent)`,
            }}
          />
        </div>
      )}

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {list.map((b, i) => (
          <g key={i}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill={`${color}10`}
              stroke={color}
              strokeWidth={0.6}
              vectorEffect="non-scaling-stroke"
              className={stage === "verifying" ? "animate-flicker" : undefined}
            />
            {/* corner ticks */}
            <Corners x={b.x} y={b.y} w={b.w} h={b.h} color={color} />
          </g>
        ))}
      </svg>

      {list.map((b, i) =>
        b.label ? (
          <span
            key={i}
            className="absolute font-mono text-[9px] uppercase tracking-widest"
            style={{
              left: `${b.x}%`,
              top: `calc(${b.y}% - 14px)`,
              color,
            }}
          >
            {b.label}
          </span>
        ) : null
      )}
    </div>
  );
}

function Corners({
  x,
  y,
  w,
  h,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}) {
  const s = 3;
  const pts = [
    [x, y, x + s, y, x, y + s],
    [x + w, y, x + w - s, y, x + w, y + s],
    [x, y + h, x + s, y + h, x, y + h - s],
    [x + w, y + h, x + w - s, y + h, x + w, y + h - s],
  ];
  return (
    <>
      {pts.map((p, i) => (
        <polyline
          key={i}
          points={`${p[1]},${p[2]} ${p[0]},${p[1]} ${p[4]},${p[5]}`}
          fill="none"
          stroke={color}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  );
}
