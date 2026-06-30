"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CloudOff,
  MapPin,
  ScrollText,
  Server,
  Users,
  Video,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shell/Page";
import { MetricStat } from "@/components/ui/MetricStat";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { CameraTile } from "@/components/camera/CameraTile";
import { SiteMap } from "@/components/map/SiteMap";
import {
  sites,
  siteById,
  camerasForSite,
  eventsForSite,
  siteCount,
  cameraCount,
} from "@/mock";
import { cn } from "@/lib/utils";

const CONNECTIVITY_COPY: Record<
  string,
  { label: string; tone: "accent" | "pending" }
> = {
  "edge-online": { label: "Edge online · Cloud sync", tone: "accent" },
  degraded: { label: "Degraded link · Edge-only verification", tone: "pending" },
  "cloud-na": { label: "Edge online · Cloud N/A", tone: "pending" },
};

export default function MapPage() {
  const offlineCount = useMemo(
    () => sites.filter((s) => s.connectivity !== "edge-online").length,
    []
  );

  // default-select the first fully-offline (cloud-na) site so the offline
  // badge is the first thing the viewer sees.
  const firstOffline = useMemo(
    () => sites.find((s) => s.connectivity === "cloud-na") ?? sites[0],
    []
  );
  const [selectedId, setSelectedId] = useState<string>(firstOffline.id);

  const site = siteById(selectedId) ?? firstOffline;
  const siteCameras = camerasForSite(site.id);
  const eventCount = eventsForSite(site.id).length;
  const conn = CONNECTIVITY_COPY[site.connectivity];
  const isOffline = site.connectivity !== "edge-online";

  return (
    <PageContainer>
      <PageHeader
        title="Site / Fleet Map"
        subtitle="One operator, the whole perimeter. Every site verifies its own alarms on-device — so the fleet scales to hundreds of sites without proportional staff."
        actions={<OnDeviceBadge variant="offline" />}
      />

      {/* stat row */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricStat
          label="Sites monitored"
          value={siteCount}
          icon={MapPin}
          delta="1 operator on shift"
        />
        <MetricStat
          label="Cameras online"
          value={cameraCount}
          icon={Video}
          tone="accent"
          delta="100% edge inference"
        />
        <MetricStat
          label="Fully offline · Cloud N/A"
          value={offlineCount}
          icon={CloudOff}
          tone="pending"
          delta="footage never leaves site"
        />
        <MetricStat
          label="Operators required"
          value={1}
          icon={Users}
          tone="safe"
          delta="scales without added staff"
        />
      </div>

      {/* hero map + detail panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-3">
          <SiteMap sites={sites} selectedId={selectedId} onSelect={setSelectedId} />
          <MapLegend />
        </div>

        <SiteDetail
          name={site.name}
          region={site.region}
          notes={site.notes}
          connLabel={conn.label}
          connTone={conn.tone}
          isOffline={isOffline}
          cameras={siteCameras}
          eventCount={eventCount}
        />
      </div>
    </PageContainer>
  );
}

function MapLegend() {
  const items: { label: string; dot: string; ring: string }[] = [
    { label: "Edge online · cloud sync", dot: "bg-accent", ring: "border-accent/70" },
    { label: "Degraded link · edge-only", dot: "bg-pending", ring: "border-pending/70" },
    { label: "Cloud N/A · fully offline", dot: "bg-accent", ring: "border-pending/80" },
  ];
  return (
    <div className="panel-2 flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
      <span className="overline">Legend</span>
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-2">
          <span
            className={cn(
              "relative flex h-3.5 w-3.5 items-center justify-center rounded-full border",
              it.ring
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", it.dot)} />
          </span>
          <span className="text-[11px] text-ink-soft">{it.label}</span>
        </span>
      ))}
    </div>
  );
}

function SiteDetail({
  name,
  region,
  notes,
  connLabel,
  connTone,
  isOffline,
  cameras,
  eventCount,
}: {
  name: string;
  region: string;
  notes?: string;
  connLabel: string;
  connTone: "accent" | "pending";
  isOffline: boolean;
  cameras: ReturnType<typeof camerasForSite>;
  eventCount: number;
}) {
  return (
    <div key={name} className="panel animate-fade-in flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="overline">Selected site</span>
          <h3 className="mt-1 truncate text-base font-semibold tracking-tight text-ink">
            {name}
          </h3>
          <p className="mono mt-0.5 text-[11px] text-ink-faint">{region}</p>
        </div>
        <OnDeviceBadge variant={isOffline ? "offline" : "default"} size="sm" />
      </div>

      {/* connectivity + footage statement */}
      <div className="mt-3 panel-2 p-3">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <CloudOff className="h-4 w-4 text-pending" />
          ) : (
            <Server className="h-4 w-4 text-accent" />
          )}
          <span
            className={cn(
              "mono text-[11px] uppercase tracking-[0.12em]",
              connTone === "accent" ? "text-accent" : "text-pending"
            )}
          >
            {connLabel}
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
          {isOffline
            ? "Verification runs entirely on the Axon edge units. No connectivity required — footage never leaves the site."
            : "Edge-verified on-device; only confirmed, explained events are routed to the cloud."}
        </p>
      </div>

      {notes && (
        <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">{notes}</p>
      )}

      {/* mini telemetry */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="panel-2 px-3 py-2">
          <span className="overline flex items-center gap-1">
            <Video className="h-3 w-3" /> Cameras
          </span>
          <span className="mono mt-1 block text-lg text-ink">{cameras.length}</span>
        </div>
        <div className="panel-2 px-3 py-2">
          <span className="overline flex items-center gap-1">
            <ScrollText className="h-3 w-3" /> Recent events
          </span>
          <span className="mono mt-1 block text-lg text-ink">{eventCount}</span>
        </div>
      </div>

      {/* cameras */}
      <div className="mt-4 flex items-center justify-between">
        <span className="overline flex items-center gap-1.5">
          <Activity className="h-3 w-3" /> Cameras on site
        </span>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {cameras.map((cam) => (
          <CameraTile key={cam.id} camera={cam} href={`/camera/${cam.id}`} />
        ))}
      </div>
    </div>
  );
}
