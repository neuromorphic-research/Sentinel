import Link from "next/link";
import { ArrowLeft, CameraOff, Timer, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import type { Rule } from "@/lib/types";
import { cameraById, siteById, eventsForCamera, rules } from "@/mock";
import { formatMs } from "@/lib/utils";
import { PageContainer } from "@/components/shell/Page";
import { StatusChip } from "@/components/ui/StatusChip";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { RulePill } from "@/components/ui/RulePill";
import { VerdictCard } from "@/components/feed/VerdictCard";
import { DeviceHealthPanel } from "@/components/device/DeviceHealthPanel";
import { CameraFeed } from "@/components/cameraview/CameraFeed";

export const metadata: Metadata = {
  title: "Single Camera · Sentinel",
};

export default function CameraViewPage({ params }: { params: { id: string } }) {
  const camera = cameraById(params.id);

  if (!camera) {
    return <NotFound id={params.id} />;
  }

  const site = siteById(camera.siteId);
  const offline =
    site?.connectivity === "cloud-na" || site?.connectivity === "degraded";
  const events = eventsForCamera(camera.id).slice(0, 4);
  // A few rules that apply to this camera's perimeter context.
  const activeRules = rules.filter((r) => r.enabled).slice(0, 3);

  return (
    <PageContainer className="max-w-[1640px]">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/camera"
            className="mono inline-flex items-center gap-1.5 text-[11px] text-ink-faint transition-colors hover:text-ink-soft"
          >
            <ArrowLeft className="h-3 w-3" />
            All cameras
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="truncate text-lg font-semibold tracking-tight text-ink">
              {camera.name}
            </h2>
            <StatusChip stage={camera.stage} />
          </div>
          <p className="mono mt-0.5 text-[11px] text-ink-soft">
            {site?.name ?? "Unknown site"} · {site?.region ?? ""} ·{" "}
            {camera.id.toUpperCase()}
          </p>
        </div>
        <OnDeviceBadge variant={offline ? "offline" : "default"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Full-bleed live feed */}
        <div className="space-y-4">
          <CameraFeed camera={camera} />
        </div>

        {/* Side panel */}
        <aside className="space-y-4">
          {/* On-device statement */}
          <div className="panel relative overflow-hidden p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
              <span className="overline">Data residency</span>
            </div>
            <p className="mt-2 text-[15px] font-medium leading-snug text-ink text-balance">
              100% on-device — this footage never left the camera.
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
              Spike detection and Talon verification run entirely on the Axon
              edge unit. No frames, clips, or telemetry are sent to the cloud.
            </p>
            <div className="mt-3">
              <OnDeviceBadge variant={offline ? "offline" : "default"} size="sm" />
            </div>
          </div>

          {/* Edge latency highlight */}
          <div className="panel flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-accent" />
              <span className="overline">Edge inference latency</span>
            </div>
            <span className="mono text-2xl font-medium text-accent">
              {formatMs(camera.device.latencyMs)}
            </span>
          </div>

          {/* Active rules */}
          <section className="panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="overline">Active rules</span>
              <Link
                href="/rules"
                className="mono text-[10px] text-accent hover:underline"
              >
                Edit
              </Link>
            </div>
            <div className="space-y-3">
              {activeRules.map((rule) => (
                <RuleRow key={rule.id} rule={rule} />
              ))}
            </div>
          </section>

          {/* Device health */}
          <DeviceHealthPanel device={camera.device} />

          {/* Recent events */}
          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="overline">Recent events</span>
              <span className="mono text-[10px] text-ink-faint">
                {eventsForCamera(camera.id).length} total
              </span>
            </div>
            {events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <VerdictCard
                    key={event.id}
                    event={event}
                    href={`/events/${event.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="panel-2 px-4 py-6 text-center">
                <p className="mono text-[11px] text-ink-faint">
                  No events recorded on this camera.
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}

function RuleRow({ rule }: { rule: Rule }) {
  return (
    <div className="rounded-lg border border-hairline bg-panel-2 p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-medium leading-snug text-ink">
          {rule.name}
        </span>
        <span className="mono shrink-0 text-[9px] uppercase tracking-[0.14em] text-safe">
          On
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <RulePill tone="accent">{rule.zone}</RulePill>
        <RulePill>{rule.schedule}</RulePill>
        {rule.objects.map((o) => (
          <RulePill key={o}>{o}</RulePill>
        ))}
        {rule.ignore.map((o) => (
          <RulePill key={o} tone="ignore">
            {o}
          </RulePill>
        ))}
      </div>
    </div>
  );
}

function NotFound({ id }: { id: string }) {
  return (
    <PageContainer>
      <div className="panel mx-auto mt-12 max-w-md p-8 text-center">
        <CameraOff className="mx-auto h-8 w-8 text-ink-faint" />
        <h2 className="mt-4 text-base font-semibold text-ink">Camera not found</h2>
        <p className="mono mt-1 text-[11px] text-ink-soft">
          No camera matches “{id}”.
        </p>
        <Link
          href="/camera"
          className="mono mt-5 inline-flex items-center gap-1.5 rounded-md border border-hairline-strong bg-elevated px-3 py-1.5 text-[11px] text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to all cameras
        </Link>
      </div>
    </PageContainer>
  );
}
