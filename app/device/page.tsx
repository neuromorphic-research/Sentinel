import { Cpu, Boxes, Timer, CloudOff } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shell/Page";
import { MetricStat } from "@/components/ui/MetricStat";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { DeviceHealthPanel } from "@/components/device/DeviceHealthPanel";
import { cameras, cameraById, cameraCount, siteCount } from "@/mock";
import { formatMs } from "@/lib/utils";
import { AxonUnit } from "@/components/devicepage/AxonUnit";
import { SpecSheet } from "@/components/devicepage/SpecSheet";
import { NoEgressPanel } from "@/components/devicepage/NoEgressPanel";
import { EdgeTelemetryTable } from "@/components/devicepage/EdgeTelemetryTable";
import { IntegratedStory } from "@/components/devicepage/IntegratedStory";

const FEATURED_ID = "cam-ns-fence";

export default function DevicePage() {
  const featured = cameraById(FEATURED_ID) ?? cameras[0];
  const avgLatency =
    cameras.reduce((sum, c) => sum + c.device.latencyMs, 0) / cameras.length;

  return (
    <PageContainer>
      <PageHeader
        title="Device / Edge Status"
        subtitle="The Axon X1 — a rugged edge-compute camera that runs Sentinel's full detect-and-verify cascade on-device."
        actions={<OnDeviceBadge />}
      />

      {/* Hero: the unit + spec sheet */}
      <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="panel relative overflow-hidden p-6">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative flex items-center justify-between">
            <div>
              <span className="overline">Edge Unit</span>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">
                Axon X1
              </h3>
              <p className="mono mt-0.5 text-[11px] text-ink-faint">
                70 TOPS · IP65 · PoE+
              </p>
            </div>
            <span className="mono inline-flex items-center gap-1.5 rounded-md border border-safe/30 bg-safe/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-safe">
              <span className="h-1.5 w-1.5 rounded-full bg-safe animate-flicker" />
              Online
            </span>
          </div>
          <AxonUnit className="relative mx-auto mt-2 max-w-[520px]" />
        </div>

        <SpecSheet />
      </section>

      {/* Headline metrics */}
      <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricStat label="Edge compute" value={70} unit="TOPS" tone="accent" icon={Cpu} />
        <MetricStat
          label="Units deployed"
          value={cameraCount}
          unit={`/ ${siteCount} sites`}
          icon={Boxes}
        />
        <MetricStat
          label="Avg edge latency"
          value={formatMs(avgLatency)}
          tone="accent"
          icon={Timer}
          delta="Spike trigger · on-device"
        />
        <MetricStat
          label="Cloud egress"
          value="0"
          unit="MB"
          tone="safe"
          icon={CloudOff}
          delta="footage never leaves the unit"
        />
      </section>

      {/* No data egress emphasis */}
      <section className="mt-4">
        <NoEgressPanel />
      </section>

      {/* Live telemetry + featured device health */}
      <section className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <EdgeTelemetryTable />
        <div className="space-y-2">
          <div className="px-1">
            <span className="overline">Featured Unit</span>
            <p className="mt-0.5 text-xs text-ink-soft">{featured.name}</p>
          </div>
          <DeviceHealthPanel device={featured.device} />
        </div>
      </section>

      {/* Integrated HW + SW story */}
      <section className="mt-4">
        <IntegratedStory />
      </section>
    </PageContainer>
  );
}
