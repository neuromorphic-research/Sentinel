"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { roiSeries } from "@/mock";
import { AXIS_TICK, CHART } from "./chartTheme";
import { ChartTooltip } from "./ChartTooltip";

/** Prominent area chart: false alarms suppressed on-device, per day. */
export function SuppressedChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={roiSeries}
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
      >
        <defs>
          <linearGradient id="suppressedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART.accent} stopOpacity={0.22} />
            <stop offset="100%" stopColor={CHART.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CHART.grid} strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="label"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: CHART.grid }}
          tickMargin={10}
          minTickGap={16}
        />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          width={48}
          domain={[0, "dataMax + 60"]}
        />
        <Tooltip
          content={<ChartTooltip unit="/ day" />}
          cursor={{ stroke: CHART.grid, strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="suppressed"
          name="Suppressed on-device"
          stroke={CHART.accent}
          strokeWidth={2}
          fill="url(#suppressedFill)"
          activeDot={{ r: 4, fill: CHART.accent, stroke: CHART.ink, strokeWidth: 1 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
