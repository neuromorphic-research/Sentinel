"use client";

import { Boxes, Hexagon, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OverlayState {
  spikeBoxes: boolean;
  zones: boolean;
  tripwires: boolean;
}

export type OverlayKey = keyof OverlayState;

const TOGGLES: { key: OverlayKey; label: string; icon: LucideIcon }[] = [
  { key: "spikeBoxes", label: "Spike boxes", icon: Boxes },
  { key: "zones", label: "Zones", icon: Hexagon },
  { key: "tripwires", label: "Tripwires", icon: Minus },
];

export function OverlayControls({
  state,
  onToggle,
  className,
}: {
  state: OverlayState;
  onToggle: (key: OverlayKey) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-lg border border-hairline bg-black/55 p-1 backdrop-blur-sm",
        className
      )}
    >
      <span className="overline px-1.5 text-ink-faint">Overlays</span>
      {TOGGLES.map((t) => {
        const active = state[t.key];
        return (
          <button
            key={t.key}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(t.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
              active
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-hairline bg-elevated text-ink-faint hover:text-ink-soft"
            )}
          >
            <t.icon className="h-3 w-3" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
