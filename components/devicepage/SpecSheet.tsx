import {
  Cpu,
  MemoryStick,
  ShieldCheck,
  Thermometer,
  Plug,
  Box,
  Camera,
  Gauge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Spec {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}

const SPECS: Spec[] = [
  { icon: Cpu, label: "Compute", value: "70 TOPS", accent: true },
  { icon: MemoryStick, label: "Memory", value: "8 GB LPDDR5" },
  { icon: Box, label: "Ingress rating", value: "IP65" },
  { icon: Thermometer, label: "Operating range", value: "−20 to +65°C" },
  { icon: Plug, label: "Power", value: "PoE+ (802.3at)" },
  { icon: Camera, label: "Sensor", value: "4K · 1/1.8\" CMOS" },
  { icon: Gauge, label: "Edge inference", value: "Spike + Talon" },
  { icon: ShieldCheck, label: "Storage", value: "256 GB on-board" },
];

export function SpecSheet({
  firmware = "v3.2.1",
  className,
}: {
  firmware?: string;
  className?: string;
}) {
  return (
    <div className={cn("panel p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="overline">Spec Sheet</span>
        <span className="mono text-[10px] text-ink-faint">
          Axon X1 · fw {firmware}
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-hairline sm:grid-cols-2">
        {SPECS.map((s) => (
          <div key={s.label} className="bg-panel-2 px-3 py-2.5">
            <dt className="flex items-center gap-1.5 overline">
              <s.icon className="h-3 w-3" />
              {s.label}
            </dt>
            <dd
              className={cn(
                "mono mt-1 text-sm",
                s.accent ? "text-accent" : "text-ink"
              )}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-hairline">
        {[
          { k: "MTBF", v: "120k hrs" },
          { k: "Weight", v: "1.4 kg" },
          { k: "Warranty", v: "5 yr" },
        ].map((x) => (
          <div key={x.k} className="bg-panel-2 px-3 py-2 text-center">
            <div className="overline">{x.k}</div>
            <div className="mono mt-0.5 text-xs text-ink-soft">{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
