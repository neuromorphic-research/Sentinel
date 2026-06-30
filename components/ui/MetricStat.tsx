import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricStat({
  label,
  value,
  unit,
  delta,
  icon: Icon,
  tone = "neutral",
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  icon?: LucideIcon;
  tone?: "neutral" | "accent" | "threat" | "safe" | "pending";
  className?: string;
}) {
  const toneText =
    tone === "accent"
      ? "text-accent"
      : tone === "threat"
        ? "text-threat"
        : tone === "safe"
          ? "text-safe"
          : tone === "pending"
            ? "text-pending"
            : "text-ink";
  return (
    <div className={cn("panel-2 p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="overline">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-ink-faint" />}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={cn("mono text-2xl font-medium", toneText)}>{value}</span>
        {unit && <span className="mono text-xs text-ink-faint">{unit}</span>}
      </div>
      {delta && <div className="mt-1 mono text-[11px] text-ink-soft">{delta}</div>}
    </div>
  );
}
