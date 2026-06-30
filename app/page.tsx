import { AlertTriangle, Clock4, Eye, Radio, ShieldCheck } from "lucide-react";
import type { Camera } from "@/lib/types";
import { PageContainer, PageHeader } from "@/components/shell/Page";
import { MetricStat } from "@/components/ui/MetricStat";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { CameraGrid } from "@/components/camera/CameraGrid";
import { EventFeed } from "@/components/feed/EventFeed";
import { DemoStage } from "@/components/liveops/DemoStage";
import { LiveClock } from "@/components/liveops/LiveClock";
import {
  cameraById,
  cameraCount,
  dismissedEvents,
  fleetStat,
  siteCount,
  verifiedEvents,
} from "@/mock";
import { formatNumber } from "@/lib/utils";

// Six cameras for the wall — mix of stages and scenes.
const GRID_IDS = [
  "cam-ns-fence",
  "cam-rs-yard",
  "cam-dc-dock",
  "cam-eq-yard",
  "cam-dp-perimeter",
  "cam-ns-cabinet",
];

const gridCameras: Camera[] = GRID_IDS.map((id) => cameraById(id)).filter(
  (c): c is Camera => Boolean(c)
);

// Feed: every verified event plus a few suppressed beats, newest first.
const feedEvents = [...verifiedEvents, ...dismissedEvents.slice(0, 3)].sort(
  (a, b) => b.order - a.order
);

export default function LiveOperationsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Live Operations"
        subtitle={`${cameraCount} cameras across ${siteCount} sites — every alarm verified on-device before it reaches you.`}
        actions={
          <>
            <LiveClock className="hidden sm:inline-flex" />
            <OnDeviceBadge />
          </>
        }
      />

      {/* ── KPI row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricStat
          label="Candidates seen"
          value={formatNumber(fleetStat.candidatesSeen)}
          icon={Eye}
          delta="Today · all sites"
        />
        <MetricStat
          label="False alarms suppressed"
          value={formatNumber(fleetStat.falseAlarmsSuppressed)}
          tone="safe"
          icon={ShieldCheck}
          delta="On-device · no alert raised"
        />
        <MetricStat
          label="Verified events"
          value={fleetStat.verifiedEvents}
          tone="threat"
          icon={AlertTriangle}
          delta="Routed to operator"
        />
        <MetricStat
          label="Guard-hours saved"
          value={fleetStat.guardHoursSaved}
          unit="hrs"
          tone="accent"
          icon={Clock4}
          delta="Vs. legacy monitoring"
        />
      </div>

      {/* ── Console: cameras + verified feed ──────────────────────── */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* left: featured demo + camera wall */}
        <div className="flex flex-col gap-4 xl:col-span-2">
          <DemoStage />

          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="overline">Camera wall</span>
              <span className="mono text-[11px] text-ink-faint">
                {gridCameras.length} of {cameraCount} live
              </span>
            </div>
            <CameraGrid
              cameras={gridCameras}
              cols="xl:grid-cols-3"
              linkBase="/camera"
            />
          </div>
        </div>

        {/* right: verified event feed */}
        <aside className="xl:col-span-1">
          <div className="panel flex max-h-[calc(100vh-7rem)] flex-col xl:sticky xl:top-4">
            <div className="flex items-center justify-between gap-2 border-b border-hairline px-4 py-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-threat" />
                <h3 className="text-sm font-semibold text-ink">
                  Verified Event Feed
                </h3>
              </div>
              <span className="mono inline-flex items-center gap-1.5 rounded-full border border-threat/30 bg-threat/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-threat">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-threat opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-threat" />
                </span>
                {verifiedEvents.length} live
              </span>
            </div>

            <div className="overflow-y-auto p-3">
              <EventFeed events={feedEvents} linkBase="/events" />
            </div>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
