"use client";

import { useEffect, useState } from "react";
import { Activity, Plug } from "lucide-react";
import { cameras, siteById } from "@/mock";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatMs, clamp, cn } from "@/lib/utils";

interface Live {
  tempC: number;
  latencyMs: number;
}

/** Per-camera Axon telemetry that gently jitters temp & latency to feel "live". */
export function EdgeTelemetryTable({ className }: { className?: string }) {
  const [live, setLive] = useState<Live[]>(() =>
    cameras.map((c) => ({ tempC: c.device.tempC, latencyMs: c.device.latencyMs }))
  );
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLive((prev) =>
        prev.map((row, i) => {
          const base = cameras[i].device;
          const tempC = clamp(
            row.tempC + (Math.random() - 0.5) * 0.8,
            base.tempC - 2,
            base.tempC + 2
          );
          const latencyMs = clamp(
            row.latencyMs + (Math.random() - 0.5) * 3,
            base.latencyMs - 4,
            base.latencyMs + 4
          );
          return { tempC, latencyMs };
        })
      );
      setTick((t) => !t);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={cn("panel overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <span className="overline">Live Edge Telemetry</span>
        <span className="mono inline-flex items-center gap-1.5 text-[10px] text-accent">
          <Activity className="h-3 w-3" />
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full bg-accent transition-opacity duration-300",
              tick ? "opacity-100" : "opacity-30"
            )}
          />
          {cameras.length} units · streaming
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline text-left">
              {["Unit", "Model", "Temp", "Latency", "Storage", "Power", "Uptime", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="overline whitespace-nowrap px-4 py-2 font-normal"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {cameras.map((c, i) => {
              const l = live[i];
              const site = siteById(c.siteId);
              const hot = l.tempC > 46;
              return (
                <tr
                  key={c.id}
                  className="border-b border-hairline/60 last:border-0 hover:bg-panel-2/60"
                >
                  <td className="px-4 py-2.5">
                    <div className="text-ink">{c.name}</div>
                    <div className="mono text-[10px] text-ink-faint">
                      {site?.name ?? c.siteId}
                    </div>
                  </td>
                  <td className="mono whitespace-nowrap px-4 py-2.5 text-xs text-ink-soft">
                    {c.device.model}
                  </td>
                  <td
                    className={cn(
                      "mono px-4 py-2.5 text-xs tabular-nums",
                      hot ? "text-pending" : "text-ink"
                    )}
                  >
                    {l.tempC.toFixed(1)}°C
                  </td>
                  <td className="mono px-4 py-2.5 text-xs text-accent tabular-nums">
                    {formatMs(l.latencyMs)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-hairline">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            c.device.storagePct > 80 ? "bg-pending" : "bg-accent/70"
                          )}
                          style={{ width: `${c.device.storagePct}%` }}
                        />
                      </div>
                      <span className="mono text-[10px] text-ink-soft">
                        {c.device.storagePct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "mono inline-flex items-center gap-1 text-[11px]",
                        c.device.poe ? "text-safe" : "text-ink-soft"
                      )}
                    >
                      <Plug className="h-3 w-3" />
                      {c.device.poe ? "PoE+" : "DC"}
                    </span>
                  </td>
                  <td className="mono px-4 py-2.5 text-xs text-ink-soft tabular-nums">
                    {c.device.uptimeDays}d
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusChip stage={c.stage} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
