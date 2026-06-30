import { Thermometer, Plug, HardDrive, Zap, Timer, ShieldCheck } from "lucide-react";
import type { DeviceHealth } from "@/lib/types";
import { formatMs, cn } from "@/lib/utils";

export function DeviceHealthPanel({
  device,
  className,
}: {
  device: DeviceHealth;
  className?: string;
}) {
  const rows = [
    { icon: Zap, label: "Compute", value: `${device.tops} TOPS`, tone: "text-accent" },
    { icon: Timer, label: "Edge latency", value: formatMs(device.latencyMs), tone: "text-accent" },
    { icon: Thermometer, label: "Temp", value: `${device.tempC}°C`, tone: device.tempC > 60 ? "text-pending" : "text-ink" },
    { icon: Plug, label: "Power", value: device.poe ? "PoE · OK" : "DC", tone: "text-safe" },
    { icon: HardDrive, label: "Storage", value: `${device.storagePct}%`, tone: "text-ink" },
    { icon: ShieldCheck, label: "Uptime", value: `${device.uptimeDays}d`, tone: "text-ink" },
  ];
  return (
    <div className={cn("panel p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="overline">Device Health</span>
        <span className="mono text-[10px] text-ink">{device.model}</span>
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-hairline">
        {rows.map((r) => (
          <div key={r.label} className="bg-panel-2 p-3">
            <div className="flex items-center gap-1.5 overline">
              <r.icon className="h-3 w-3" />
              {r.label}
            </div>
            <div className={cn("mono mt-1 text-sm", r.tone)}>{r.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-md border border-accent/20 bg-accent/5 px-3 py-2">
        <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
        <span className="text-[11px] text-ink-soft">
          100% on-device — this footage never left the camera.
        </span>
      </div>
    </div>
  );
}
