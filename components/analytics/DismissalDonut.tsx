"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { dismissalBreakdown } from "@/mock";
import { formatNumber } from "@/lib/utils";
import { DISMISSAL_COLORS } from "./chartTheme";
import { ChartTooltip } from "./ChartTooltip";

const TOTAL = dismissalBreakdown.reduce((sum, d) => sum + d.count, 0);

/** Donut of why on-device suppressions happened, with a center total + legend. */
export function DismissalDonut() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-[180px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dismissalBreakdown}
              dataKey="count"
              nameKey="reason"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="#0A0B0D"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            >
              {dismissalBreakdown.map((d) => (
                <Cell key={d.key} fill={DISMISSAL_COLORS[d.key] ?? "#6B7280"} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip unit="suppressed" />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="mono text-2xl font-medium text-ink">
            {formatNumber(TOTAL)}
          </span>
          <span className="overline mt-1">Suppressed</span>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {dismissalBreakdown.map((d) => {
          const pct = ((d.count / TOTAL) * 100).toFixed(1);
          return (
            <li key={d.key} className="flex items-center gap-2.5 text-[12px]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ background: DISMISSAL_COLORS[d.key] ?? "#6B7280" }}
              />
              <span className="flex-1 truncate text-ink-soft">{d.reason}</span>
              <span className="mono text-ink">{formatNumber(d.count)}</span>
              <span className="mono w-12 text-right text-ink-faint">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
