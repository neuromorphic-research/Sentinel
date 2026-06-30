"use client";

import { CloudOff, Radio, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Site } from "@/lib/types";
import { cn } from "@/lib/utils";

type Connectivity = Site["connectivity"];

interface ConnectivityMeta {
  /** live core dot — edge is always alive */
  dot: string;
  /** pulsing ring color */
  ring: string;
  /** text + label color */
  text: string;
  /** soft fill behind the marker */
  halo: string;
  /** short status copy */
  label: string;
  icon: LucideIcon;
  /** dramatize the offline-capable sites */
  offline: boolean;
}

const CONNECTIVITY: Record<Connectivity, ConnectivityMeta> = {
  "edge-online": {
    dot: "bg-accent",
    ring: "border-accent/70",
    text: "text-accent",
    halo: "bg-accent/15",
    label: "Edge online · Cloud sync",
    icon: Wifi,
    offline: false,
  },
  degraded: {
    dot: "bg-pending",
    ring: "border-pending/70",
    text: "text-pending",
    halo: "bg-pending/15",
    label: "Degraded link · Edge-only",
    icon: Radio,
    offline: true,
  },
  "cloud-na": {
    // edge core stays live (cyan) while the cloud ring goes amber — the story
    dot: "bg-accent",
    ring: "border-pending/80",
    text: "text-pending",
    halo: "bg-pending/15",
    label: "Edge online · Cloud N/A",
    icon: CloudOff,
    offline: true,
  },
};

function SiteMarker({
  site,
  selected,
  onSelect,
}: {
  site: Site;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const meta = CONNECTIVITY[site.connectivity];
  const Icon = meta.icon;
  const dramatic = site.connectivity === "cloud-na";

  return (
    <button
      type="button"
      onClick={() => onSelect(site.id)}
      aria-pressed={selected}
      aria-label={`${site.name} — ${meta.label}`}
      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{ left: `${site.x * 100}%`, top: `${site.y * 100}%` }}
    >
      {/* pulsing rings */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          className={cn(
            "absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 animate-pulse-ring",
            meta.ring
          )}
        />
        {dramatic && (
          <span
            className={cn(
              "absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 animate-pulse-ring",
              meta.ring
            )}
            style={{ animationDelay: "0.9s" }}
          />
        )}
      </span>

      {/* soft halo */}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md transition-opacity",
          meta.halo,
          selected ? "opacity-100" : "opacity-40 group-hover:opacity-80"
        )}
      />

      {/* core marker */}
      <span
        className={cn(
          "relative flex h-7 w-7 items-center justify-center rounded-full border bg-base/80 backdrop-blur-sm transition-all",
          selected
            ? "scale-110 border-accent shadow-glow"
            : "border-hairline-strong group-hover:border-accent/60"
        )}
      >
        <span className={cn("absolute h-2 w-2 rounded-full", meta.dot)} />
        <Icon className={cn("relative h-3.5 w-3.5", meta.text)} />
      </span>

      {/* label card */}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border bg-panel/95 px-2 py-1 text-left backdrop-blur-sm transition-all",
          selected
            ? "border-accent/40 opacity-100"
            : "border-hairline opacity-0 group-hover:opacity-100",
          dramatic && !selected && "opacity-100"
        )}
      >
        <span className="block text-[11px] font-medium leading-tight text-ink">
          {site.name}
        </span>
        <span
          className={cn(
            "mono mt-0.5 flex items-center gap-1 text-[9px] uppercase tracking-[0.12em]",
            meta.text
          )}
        >
          <Icon className="h-2.5 w-2.5" />
          {meta.label}
        </span>
      </span>
    </button>
  );
}

export function SiteMap({
  sites,
  selectedId,
  onSelect,
  className,
}: {
  sites: Site[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "panel relative overflow-hidden",
        className
      )}
    >
      {/* control-room grid backdrop */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* abstract regional map: graticule + faint landmasses */}
      <svg
        viewBox="0 0 100 70"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="landmass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15181E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#101216" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* faint landmass / region shapes */}
        <g stroke="#2E333D" strokeWidth="0.15" fill="url(#landmass)">
          <path d="M8 14 L30 9 L46 18 L42 34 L24 40 L10 30 Z" />
          <path d="M50 8 L78 6 L92 20 L86 30 L66 28 L54 20 Z" />
          <path d="M40 42 L66 38 L74 52 L62 64 L42 62 L34 50 Z" />
          <path d="M78 38 L94 40 L96 58 L82 62 L76 50 Z" />
        </g>

        {/* graticule */}
        <g stroke="#23272F" strokeWidth="0.1">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="70" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} />
          ))}
        </g>
      </svg>

      {/* corner telemetry labels */}
      <div className="pointer-events-none absolute left-3 top-3 overline">
        Fleet Map · Region View
      </div>
      <div className="pointer-events-none absolute right-3 top-3 mono text-[10px] text-ink-faint">
        LAT 41.2°N / LON 74.0°W
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 mono text-[10px] text-ink-faint">
        SCALE 1:250k · GRID 10′
      </div>

      {/* marker layer */}
      <div className="relative aspect-[10/7] w-full">
        {sites.map((site) => (
          <SiteMarker
            key={site.id}
            site={site}
            selected={site.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
