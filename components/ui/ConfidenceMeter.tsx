import { cn } from "@/lib/utils";

export function ConfidenceMeter({
  value,
  tone = "threat",
  className,
  showLabel = true,
}: {
  value: number; // 0..100
  tone?: "threat" | "safe" | "accent" | "pending";
  className?: string;
  showLabel?: boolean;
}) {
  const bar =
    tone === "safe"
      ? "bg-safe"
      : tone === "accent"
        ? "bg-accent"
        : tone === "pending"
          ? "bg-pending"
          : "bg-threat";
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <span className="overline">Confidence</span>
          <span className="mono text-xs text-ink">{value}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className={cn("h-full rounded-full transition-all duration-700", bar)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
