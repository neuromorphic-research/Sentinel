"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { roiSeries } from "@/mock";
import { AXIS_TICK, CHART } from "./chartTheme";
import { ChartTooltip } from "./ChartTooltip";

/**
 * Dual-line comparison dramatizing the gap between legacy alarm volume
 * (hundreds/day reaching an operator) and Sentinel's verified-only output.
 */
export function BeforeAfterChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={roiSeries} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
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
          content={<ChartTooltip unit="alarms" />}
          cursor={{ stroke: CHART.grid, strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="legacyAlarms"
          name="Legacy system"
          stroke={CHART.threat}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: CHART.threat, stroke: CHART.ink, strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="sentinelAlarms"
          name="Sentinel"
          stroke={CHART.safe}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: CHART.safe, stroke: CHART.ink, strokeWidth: 1 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
