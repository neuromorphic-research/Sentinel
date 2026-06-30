"use client";

import { motion } from "framer-motion";
import { cn, formatMs } from "@/lib/utils";

/**
 * A cinematic timeline beneath the event clip. Marks the Spike trigger and the
 * Talon verdict with mono times, and runs an animated playhead from trigger to
 * verdict on a loop. Purely decorative / scripted — no real scrubbing logic.
 */
export function TimelineScrubber({
  spikeMs,
  talonMs,
  verified,
  className,
}: {
  spikeMs: number;
  talonMs: number;
  verified: boolean;
  className?: string;
}) {
  const total = spikeMs + talonMs;
  // Spike lock lands very early; pad it so the marker is never flush at 0%.
  const spikePct = Math.min(Math.max((spikeMs / total) * 100, 6), 26);
  const verdictColor = verified ? "#F2495C" : "#3BB273";

  const markers = [
    { pct: 0, label: "Spike trigger", time: "0ms", color: "#22D3EE" },
    { pct: spikePct, label: "Spike lock", time: formatMs(spikeMs), color: "#22D3EE" },
    {
      pct: 100,
      label: verified ? "Talon verdict" : "Talon dismiss",
      time: formatMs(total),
      color: verdictColor,
    },
  ];

  return (
    <div className={cn("panel-2 px-4 pb-7 pt-3", className)}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="overline">Cascade timeline</span>
        <span className="mono text-[10px] text-ink-faint">
          T+0 → T+{formatMs(total)}
        </span>
      </div>

      <div className="relative h-1.5 w-full rounded-full bg-elevated">
        {/* Spike segment (trigger → lock) in accent */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent/50"
          style={{ width: `${spikePct}%` }}
        />
        {/* Talon segment (lock → verdict) tinted by outcome */}
        <div
          className="absolute inset-y-0 rounded-full"
          style={{
            left: `${spikePct}%`,
            right: 0,
            background: verified
              ? "linear-gradient(90deg, rgba(245,165,36,0.45), rgba(242,73,92,0.55))"
              : "linear-gradient(90deg, rgba(245,165,36,0.4), rgba(59,178,115,0.5))",
          }}
        />

        {/* Animated playhead */}
        <motion.div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-base"
          style={{ background: verdictColor, boxShadow: `0 0 10px ${verdictColor}` }}
          initial={{ left: "0%" }}
          animate={{ left: ["0%", "100%"] }}
          transition={{
            duration: 3.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.8,
          }}
        />

        {/* Markers */}
        {markers.map((m) => (
          <div
            key={m.label}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${m.pct}%` }}
          >
            <span
              className="block h-3 w-px -translate-x-1/2"
              style={{ background: m.color }}
            />
          </div>
        ))}
      </div>

      {/* Marker labels */}
      <div className="relative mt-2 h-6">
        {markers.map((m) => (
          <div
            key={m.label}
            className={cn(
              "absolute flex flex-col leading-tight",
              m.pct === 0 && "items-start",
              m.pct === 100 && "items-end -translate-x-full",
              m.pct !== 0 && m.pct !== 100 && "items-center -translate-x-1/2"
            )}
            style={{ left: `${m.pct}%` }}
          >
            <span className="overline text-[8px]" style={{ color: m.color }}>
              {m.label}
            </span>
            <span className="mono text-[10px] text-ink-soft">{m.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
