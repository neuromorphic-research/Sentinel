import {
  Activity,
  BadgeCheck,
  CircleDollarSign,
  Clock,
  ShieldCheck,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shell/Page";
import { MetricStat } from "@/components/ui/MetricStat";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { BeforeAfterChart } from "@/components/analytics/BeforeAfterChart";
import { DismissalDonut } from "@/components/analytics/DismissalDonut";
import { SuppressedChart } from "@/components/analytics/SuppressedChart";
import {
  dismissalBreakdown,
  fleetStat,
  roiHeadline,
  roiSeries,
  verifiedEvents,
} from "@/mock";
import type { VerificationKind } from "@/lib/types";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const totalSuppressed = roiSeries.reduce((sum, d) => sum + d.suppressed, 0);
const totalVerified = roiSeries.reduce((sum, d) => sum + d.verified, 0);

const VERIFICATION_LABEL: Record<VerificationKind, string> = {
  "fence-climb": "Fence breach",
  loitering: "Loitering / theft",
  "vehicle-restricted": "Vehicle · restricted",
  tampering: "Tampering",
  "perimeter-breach": "Perimeter breach",
};

const recentVerified = verifiedEvents.slice(0, 5);

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Analytics / ROI"
        subtitle="What Sentinel suppressed on-device, what reached a human, and what it saved. Last 14 days."
        actions={
          <div className="flex items-center gap-2.5">
            <span className="overline hidden sm:inline">
              {roiHeadline.sitesMonitored} sites · {roiHeadline.camerasOnline}{" "}
              cameras
            </span>
            <OnDeviceBadge />
          </div>
        }
      />

      {/* 1 — Headline KPI row */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <MetricStat
          label="To a human · before"
          value={formatNumber(roiHeadline.legacyAlarmsPerDay)}
          unit="/ day"
          delta="Legacy alarm volume"
          icon={Activity}
          tone="threat"
        />
        <MetricStat
          label="To a human · after"
          value={formatNumber(roiHeadline.sentinelAlarmsPerDay)}
          unit="/ day"
          delta="Verified events only"
          icon={ShieldCheck}
          tone="safe"
        />
        <MetricStat
          label="Alarm reduction"
          value={roiHeadline.reductionPct}
          unit="%"
          delta="Fewer operator interrupts"
          icon={TrendingDown}
          tone="accent"
        />
        <MetricStat
          label="Guard-hours saved"
          value={formatNumber(fleetStat.guardHoursSaved)}
          unit="hrs / day"
          delta={`${formatNumber(roiHeadline.falseDispatchesAvoidedMonthly)} false dispatches avoided / mo`}
          icon={Clock}
          tone="neutral"
        />
        <MetricStat
          label="Monthly savings"
          value={formatCurrency(roiHeadline.monthlySavings)}
          delta="Guard rotation vs Sentinel"
          icon={CircleDollarSign}
          tone="accent"
        />
      </section>

      {/* 2 — False alarms suppressed over time (prominent) */}
      <section className="panel mt-3 p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              False alarms suppressed over time
            </h3>
            <p className="mt-0.5 text-[12px] text-ink-soft">
              Resolved on-device by Talon — never raised, never dispatched, never
              left the camera.
            </p>
          </div>
          <div className="text-right">
            <div className="mono text-xl font-medium text-accent">
              {formatNumber(totalSuppressed)}
            </div>
            <div className="overline mt-0.5">Suppressed · 14d</div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <SuppressedChart />
        </div>
      </section>

      {/* 3 + 4 — Before/after comparison and dismissal breakdown */}
      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="panel p-5 xl:col-span-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                Alarms reaching a human — before vs after
              </h3>
              <p className="mt-0.5 text-[12px] text-ink-soft">
                Legacy systems flood operators with unverified motion. Sentinel
                forwards only what it can explain.
              </p>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <LegendDot color="#F2495C" label="Legacy" />
              <LegendDot color="#3BB273" label="Sentinel" />
            </div>
          </div>
          <div className="h-[280px] w-full">
            <BeforeAfterChart />
          </div>
        </div>

        <div className="panel p-5 xl:col-span-4">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-ink">
              Why alarms were suppressed
            </h3>
            <p className="mt-0.5 text-[12px] text-ink-soft">
              On-device dismissal reasons · 14 days
            </p>
          </div>
          <div className="h-[330px]">
            <DismissalDonut />
          </div>
        </div>
      </section>

      {/* 5 + 6 — Cost comparison and verified incidents */}
      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="panel p-5 xl:col-span-5">
          <h3 className="text-sm font-semibold text-ink">Monthly cost</h3>
          <p className="mt-0.5 text-[12px] text-ink-soft">
            24/7 guard rotation versus a Sentinel edge deployment of the same
            perimeter.
          </p>

          <div className="mt-5 space-y-4">
            <CostBar
              label="Guard rotation"
              value={roiHeadline.guardRotationCostMonthly}
              max={roiHeadline.guardRotationCostMonthly}
              tone="threat"
            />
            <CostBar
              label="Sentinel"
              value={roiHeadline.sentinelCostMonthly}
              max={roiHeadline.guardRotationCostMonthly}
              tone="safe"
            />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
            <div>
              <div className="overline">Net monthly savings</div>
              <div className="mt-1 text-[11px] text-ink-faint">
                {(
                  (roiHeadline.monthlySavings /
                    roiHeadline.guardRotationCostMonthly) *
                  100
                ).toFixed(0)}
                % lower run-rate
              </div>
            </div>
            <div className="mono text-2xl font-medium text-accent">
              {formatCurrency(roiHeadline.monthlySavings)}
            </div>
          </div>
        </div>

        <div className="panel p-5 xl:col-span-7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                Verified incidents
              </h3>
              <p className="mt-0.5 text-[12px] text-ink-soft">
                Real events that warranted a human — each with a written verdict.
              </p>
            </div>
            <div className="text-right">
              <div className="mono text-xl font-medium text-threat">
                {formatNumber(totalVerified)}
              </div>
              <div className="overline mt-0.5">Confirmed · 14d</div>
            </div>
          </div>

          <ul className="divide-y divide-hairline">
            {recentVerified.map((e) => (
              <li key={e.id} className="flex items-start gap-3 py-2.5">
                <span className="mt-0.5 inline-flex items-center gap-1.5 rounded border border-threat/30 bg-threat/10 px-1.5 py-0.5">
                  <BadgeCheck className="h-3 w-3 text-threat" />
                  <span className="mono text-[10px] uppercase tracking-[0.12em] text-threat">
                    {e.verificationKind
                      ? VERIFICATION_LABEL[e.verificationKind]
                      : "Verified"}
                  </span>
                </span>
                <p className="flex-1 line-clamp-2 text-[12px] leading-snug text-ink-soft">
                  {e.verdict}
                </p>
                <div className="shrink-0 text-right">
                  <div className="mono text-[12px] text-ink">{e.confidence}%</div>
                  <div className="mono text-[10px] text-ink-faint">
                    {e.timestamp}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-faint">
            <UserCheck className="h-3.5 w-3.5" />
            <span>
              {formatNumber(dismissalBreakdown.reduce((s, d) => s + d.count, 0))}{" "}
              suppressions for every {totalVerified} verified — surfaced calmly,
              with reasons.
            </span>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-ink-soft">
      <span
        className="h-2 w-2 rounded-[2px]"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function CostBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "threat" | "safe";
}) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12px] text-ink-soft">{label}</span>
        <span
          className={cn(
            "mono text-sm",
            tone === "threat" ? "text-threat" : "text-safe"
          )}
        >
          {formatCurrency(value)}
          <span className="text-ink-faint"> / mo</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-panel-2">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "threat" ? "bg-threat" : "bg-safe"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
