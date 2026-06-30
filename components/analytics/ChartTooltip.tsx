"use client";

import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatNumber } from "@/lib/utils";

/** Dark, mono-styled tooltip reused across every analytics chart. */
export function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<ValueType, NameType> & { unit?: string }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="min-w-[160px] rounded-md border border-hairline-strong bg-elevated px-3 py-2 shadow-panel">
      {label !== undefined && <div className="overline mb-1.5">{label}</div>}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div
            key={`${String(entry.dataKey ?? entry.name ?? i)}`}
            className="flex items-center justify-between gap-5"
          >
            <span className="flex items-center gap-1.5 text-[11px] text-ink-soft">
              <span
                className="h-2 w-2 rounded-[2px]"
                style={{ background: entry.color ?? CHART_FALLBACK }}
              />
              {entry.name}
            </span>
            <span className="mono text-[11px] text-ink">
              {typeof entry.value === "number"
                ? formatNumber(entry.value)
                : String(entry.value ?? "")}
              {unit ? ` ${unit}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CHART_FALLBACK = "#6B7280";
