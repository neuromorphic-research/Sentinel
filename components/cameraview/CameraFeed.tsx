"use client";

import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";
import type { Camera } from "@/lib/types";
import { SceneFrame } from "@/components/scene/SceneFrame";
import { DetectionOverlay } from "@/components/scene/DetectionOverlay";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatMs, cn } from "@/lib/utils";
import { OverlayControls, type OverlayKey, type OverlayState } from "./OverlayControls";

interface Zone {
  id: string;
  label: string;
  points: string;
  /** label anchor in frame % */
  lx: number;
  ly: number;
  tone: string;
}

interface Tripwire {
  id: string;
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const ZONES: Zone[] = [
  {
    id: "restricted",
    label: "Restricted Zone",
    points: "3,60 40,47 60,66 32,88 3,88",
    lx: 6,
    ly: 70,
    tone: "#F2495C",
  },
  {
    id: "watch",
    label: "Watch Area",
    points: "64,42 97,35 97,72 70,72",
    lx: 67,
    ly: 50,
    tone: "#22D3EE",
  },
];

const TRIPWIRES: Tripwire[] = [
  { id: "tw-a", label: "Tripwire A", x1: 0, y1: 68, x2: 100, y2: 54 },
  { id: "tw-b", label: "Tripwire B", x1: 0, y1: 90, x2: 100, y2: 82 },
];

// A couple of plausible Spike candidate boxes so the toggle reads as real.
const SPIKE_BOXES = [
  { x: 44, y: 38, w: 15, h: 44, label: "track-01" },
  { x: 70, y: 52, w: 11, h: 26, label: "track-02" },
];

function useLiveClock(): string {
  const [time, setTime] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function CameraFeed({
  camera,
  className,
}: {
  camera: Camera;
  className?: string;
}) {
  const [overlays, setOverlays] = useState<OverlayState>({
    spikeBoxes: true,
    zones: false,
    tripwires: false,
  });
  const time = useLiveClock();

  const toggle = (key: OverlayKey) =>
    setOverlays((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-hairline bg-panel",
        className
      )}
    >
      <div className="relative aspect-video w-full">
        <SceneFrame scene={camera.scene} className="h-full w-full" />

        {/* Spike detection boxes */}
        {overlays.spikeBoxes && (
          <DetectionOverlay stage={camera.stage} boxes={SPIKE_BOXES} />
        )}

        {/* Zones + tripwires */}
        {(overlays.zones || overlays.tripwires) && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            {overlays.zones &&
              ZONES.map((z) => (
                <polygon
                  key={z.id}
                  points={z.points}
                  fill={`${z.tone}1f`}
                  stroke={z.tone}
                  strokeWidth={0.5}
                  strokeDasharray="2 1.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            {overlays.tripwires &&
              TRIPWIRES.map((t) => (
                <line
                  key={t.id}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="#22D3EE"
                  strokeWidth={0.8}
                  strokeDasharray="3 2"
                  vectorEffect="non-scaling-stroke"
                  className="animate-flicker"
                />
              ))}
          </svg>
        )}

        {/* Zone / tripwire labels (HTML so text stays crisp) */}
        {overlays.zones &&
          ZONES.map((z) => (
            <span
              key={z.id}
              className="absolute font-mono text-[9px] uppercase tracking-[0.14em]"
              style={{ left: `${z.lx}%`, top: `${z.ly}%`, color: z.tone }}
            >
              {z.label}
            </span>
          ))}
        {overlays.tripwires &&
          TRIPWIRES.map((t) => (
            <span
              key={t.id}
              className="absolute font-mono text-[9px] uppercase tracking-[0.14em] text-accent"
              style={{ left: "1.5%", top: `calc(${t.y1}% - 12px)` }}
            >
              {t.label}
            </span>
          ))}

        {/* Top HUD row */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex items-center gap-2">
            <span className="mono flex items-center gap-1.5 rounded bg-black/55 px-2 py-1 text-[11px] text-threat backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-threat" />
              REC
            </span>
            <span className="mono rounded bg-black/55 px-2 py-1 text-[11px] text-ink backdrop-blur-sm">
              {time}
            </span>
          </div>
          <StatusChip stage={camera.stage} />
        </div>

        {/* Bottom HUD row */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <div className="rounded bg-black/55 px-2 py-1 backdrop-blur-sm">
            <div className="text-xs font-medium text-ink">{camera.name}</div>
            <div className="mono text-[10px] text-ink-soft">
              {camera.id.toUpperCase()} · Spike {formatMs(camera.device.latencyMs)}
            </div>
          </div>
          <span className="mono inline-flex items-center gap-1 rounded bg-black/55 px-2 py-1 text-[10px] text-ink-faint backdrop-blur-sm">
            <Maximize2 className="h-3 w-3" />
            1920 × 1080
          </span>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between gap-3 border-t border-hairline bg-panel-2 px-3 py-2">
        <OverlayControls state={overlays} onToggle={toggle} />
        <span className="mono hidden text-[10px] text-ink-faint sm:inline">
          Live · on-device
        </span>
      </div>
    </div>
  );
}
