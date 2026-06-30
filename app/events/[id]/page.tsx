import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  Megaphone,
  Bell,
  Siren,
  Lightbulb,
  Truck,
  FileText,
  MapPin,
  Camera as CameraIcon,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { ActionKind } from "@/lib/types";
import { ACTION_LABELS, DISMISSAL_LABELS } from "@/lib/status";
import { eventById, siteById, cameraById, eventsForSite, rules } from "@/mock";
import { cn, formatMs } from "@/lib/utils";
import { PageContainer } from "@/components/shell/Page";
import { SceneFrame } from "@/components/scene/SceneFrame";
import { DetectionOverlay } from "@/components/scene/DetectionOverlay";
import { CascadeTrace } from "@/components/cascade/CascadeTrace";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { StatusChip } from "@/components/ui/StatusChip";
import { RulePill } from "@/components/ui/RulePill";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { TimelineScrubber } from "@/components/eventdetail/TimelineScrubber";
import { EdgeCascade } from "@/components/eventdetail/EdgeCascade";
import { OverrideActions } from "@/components/eventdetail/OverrideActions";

const ACTION_ICONS: Record<ActionKind, LucideIcon> = {
  "talk-down": Megaphone,
  "notify-soc": Bell,
  dispatch: Truck,
  lights: Lightbulb,
  "log-only": FileText,
  siren: Siren,
};

function NotFound() {
  return (
    <PageContainer>
      <div className="panel mx-auto mt-16 flex max-w-md flex-col items-center gap-4 px-8 py-12 text-center">
        <AlertTriangle className="h-8 w-8 text-pending" />
        <div>
          <h2 className="text-lg font-semibold text-ink">Event not found</h2>
          <p className="mt-1 text-sm text-ink-soft">
            This event ID isn’t in the log. It may have rolled off the on-device
            buffer.
          </p>
        </div>
        <Link
          href="/events"
          className="mono inline-flex items-center gap-1.5 rounded-md border border-hairline-strong px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Event Log
        </Link>
      </div>
    </PageContainer>
  );
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = eventById(params.id);
  if (!event) return <NotFound />;

  const cam = cameraById(event.cameraId);
  const site = siteById(event.siteId);
  const verified = event.stage === "verified";
  const tone = verified ? "threat" : "safe";
  const matchedRuleObj = rules.find((r) => r.name === event.matchedRule);
  const dismissalLabel = event.dismissalReason
    ? DISMISSAL_LABELS[event.dismissalReason]
    : "Non-event";

  const primaryAction = event.actions.find((a) => a.kind !== "log-only");
  const related = eventsForSite(event.siteId).filter((e) => e.id !== event.id);

  return (
    <PageContainer className="animate-fade-in">
      {/* Back + breadcrumb */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/events"
          className="mono inline-flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Event Log
        </Link>
        <div className="flex items-center gap-2">
          <StatusChip stage={event.stage} />
          <span className="mono text-xs text-ink-faint">{event.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── Main column ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Clip + timeline */}
          <div className="flex flex-col gap-3">
            <div className="panel relative overflow-hidden">
              <SceneFrame
                scene={cam?.scene ?? "perimeter"}
                className="aspect-video w-full"
              />
              <DetectionOverlay
                stage={event.stage}
                scan={false}
                boxes={[
                  {
                    x: 42,
                    y: 30,
                    w: 18,
                    h: 50,
                    label: verified ? "subject" : dismissalLabel.toLowerCase(),
                  },
                ]}
              />

              {/* Outcome banner over the clip */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-base/90 to-transparent p-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md border",
                      verified
                        ? "border-threat/40 bg-threat/15 text-threat"
                        : "border-safe/40 bg-safe/15 text-safe"
                    )}
                  >
                    {verified ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <div
                      className={cn(
                        "mono text-sm font-semibold uppercase tracking-[0.12em]",
                        verified ? "text-threat" : "text-safe"
                      )}
                    >
                      {verified ? "Verified intrusion" : "Dismissed"}
                    </div>
                    <div className="mono text-[11px] text-ink-soft">
                      {verified
                        ? site?.name
                        : `Suppressed on-device · ${dismissalLabel}`}
                    </div>
                  </div>
                </div>
                <span className="mono text-[11px] text-ink-faint">
                  {cam?.name}
                </span>
              </div>
            </div>

            <TimelineScrubber
              spikeMs={event.spikeLatencyMs}
              talonMs={event.talonLatencyMs}
              verified={verified}
            />
          </div>

          {/* Talon verdict panel */}
          <section className="panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="overline">Talon · Verdict</span>
              <span className="mono text-[11px] text-ink-faint">
                reasoned in {formatMs(event.talonLatencyMs)}
              </span>
            </div>

            <p className="text-balance text-[15px] leading-relaxed text-ink">
              {event.verdict}
            </p>

            <div className="mt-5">
              <ConfidenceMeter value={event.confidence} tone={tone} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {event.matchedRule ? (
                <Link href="/rules" className="focus:outline-none">
                  <RulePill tone="accent">
                    Rule · {event.matchedRule}
                  </RulePill>
                </Link>
              ) : (
                <RulePill tone="neutral">No rule matched · suppressed</RulePill>
              )}
              {matchedRuleObj && (
                <span className="mono text-[10px] text-ink-faint">
                  {matchedRuleObj.schedule} · {matchedRuleObj.zone}
                </span>
              )}
            </div>
          </section>

          {/* Cascade trace */}
          <section className="panel p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <span className="overline">Edge cascade</span>
              <span className="mono text-[11px] text-ink-faint">
                Spike → Talon → {verified ? "Action" : "Suppress"}
              </span>
            </div>
            {verified ? (
              <CascadeTrace
                spikeMs={event.spikeLatencyMs}
                talonMs={event.talonLatencyMs}
                actionLabel={
                  primaryAction
                    ? ACTION_LABELS[primaryAction.kind]
                    : "Action triggered"
                }
              />
            ) : (
              <EdgeCascade
                spikeMs={event.spikeLatencyMs}
                talonMs={event.talonLatencyMs}
                reasonLabel={dismissalLabel}
              />
            )}
            <p className="mono mt-3.5 text-[11px] leading-relaxed text-ink-faint">
              All inference ran on the Axon edge unit. No footage left the camera.
            </p>
          </section>

          {/* Actions taken + overrides */}
          <section className="panel p-5">
            <span className="overline">Actions taken</span>
            <ul className="mt-3 flex flex-col divide-y divide-hairline">
              {event.actions.map((a) => {
                const Icon = ACTION_ICONS[a.kind];
                const isLog = a.kind === "log-only";
                return (
                  <li
                    key={`${a.kind}-${a.at}`}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md border",
                          isLog
                            ? "border-hairline bg-elevated text-ink-faint"
                            : verified
                              ? "border-threat/30 bg-threat/10 text-threat"
                              : "border-safe/30 bg-safe/10 text-safe"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm text-ink">
                        {ACTION_LABELS[a.kind]}
                      </span>
                    </span>
                    <span className="mono text-[11px] text-ink-faint">{a.at}</span>
                  </li>
                );
              })}
            </ul>

            <div className="my-4 h-px bg-hairline" />

            <OverrideActions />
          </section>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside className="flex flex-col gap-5">
          <div className="panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="overline">Event metadata</span>
              <OnDeviceBadge
                size="sm"
                variant={site?.connectivity === "edge-online" ? "default" : "offline"}
              />
            </div>
            <dl className="flex flex-col gap-2.5 text-sm">
              <MetaRow icon={FileText} label="Event ID" value={event.id} />
              <MetaRow icon={MapPin} label="Site" value={site?.name ?? "—"} />
              <MetaRow icon={CameraIcon} label="Camera" value={cam?.name ?? "—"} />
              <MetaRow icon={Clock} label="Timestamp" value={event.timestamp} />
              <MetaRow
                icon={ShieldCheck}
                label="Edge device"
                value={cam ? `${cam.device.model} · ${cam.device.tops} TOPS` : "—"}
              />
            </dl>
          </div>

          <div className="panel p-5">
            <span className="overline">Latency readout</span>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <Readout label="Spike" value={formatMs(event.spikeLatencyMs)} tone="text-accent" />
              <Readout label="Talon" value={formatMs(event.talonLatencyMs)} tone="text-pending" />
            </div>
          </div>

          <div className="panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="overline">Related at this site</span>
              <span className="mono text-[10px] text-ink-faint">{related.length}</span>
            </div>
            {related.length === 0 ? (
              <p className="mono text-[11px] text-ink-faint">
                No other events at {site?.name}.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {related.slice(0, 6).map((e) => {
                  const isVerified = e.stage === "verified";
                  return (
                    <li key={e.id}>
                      <Link
                        href={`/events/${e.id}`}
                        className="group flex items-center gap-2.5 rounded-lg border border-hairline bg-panel-2 px-3 py-2 transition-colors hover:border-hairline-strong"
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            isVerified ? "bg-threat" : "bg-safe"
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-1 text-xs text-ink-soft group-hover:text-ink">
                            {e.verdict}
                          </span>
                          <span className="mono text-[10px] text-ink-faint">
                            {e.timestamp} · {e.id}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-ink-faint">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
      </dt>
      <dd className="mono truncate text-right text-xs text-ink">{value}</dd>
    </div>
  );
}

function Readout({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-elevated px-3 py-2.5">
      <div className="overline">{label}</div>
      <div className={cn("mono mt-1 text-lg font-medium", tone)}>{value}</div>
    </div>
  );
}
