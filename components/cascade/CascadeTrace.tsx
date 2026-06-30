import { Activity, Brain, Megaphone, ArrowRight } from "lucide-react";
import { formatMs, cn } from "@/lib/utils";

/**
 * Spike → Talon → Action cascade with mono timings. The recurring motif that
 * makes "edge" tangible. Use compact for cards, default for the detail page.
 */
export function CascadeTrace({
  spikeMs,
  talonMs,
  actionLabel = "Action triggered",
  compact = false,
  className,
}: {
  spikeMs: number;
  talonMs: number;
  actionLabel?: string;
  compact?: boolean;
  className?: string;
}) {
  const steps = [
    {
      icon: Activity,
      block: "Spike",
      desc: "detected person",
      time: formatMs(spikeMs),
      tone: "text-accent",
    },
    {
      icon: Brain,
      block: "Talon",
      desc: "verified intrusion",
      time: formatMs(talonMs),
      tone: "text-pending",
    },
    {
      icon: Megaphone,
      block: "Action",
      desc: actionLabel,
      time: "live",
      tone: "text-threat",
    },
  ];

  return (
    <div
      className={cn(
        "flex items-stretch gap-2",
        compact ? "text-[10px]" : "text-xs",
        className
      )}
    >
      {steps.map((s, i) => (
        <div key={s.block} className="flex flex-1 items-center gap-2">
          <div
            className={cn(
              "flex-1 rounded-lg border border-hairline bg-elevated",
              compact ? "px-2 py-1.5" : "px-3 py-2.5"
            )}
          >
            <div className="flex items-center gap-1.5">
              <s.icon className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5", s.tone)} />
              <span className={cn("font-medium", s.tone)}>{s.block}</span>
            </div>
            {!compact && (
              <div className="mt-0.5 text-ink-soft">{s.desc}</div>
            )}
            <div className="mono mt-0.5 text-ink-faint">{s.time}</div>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
          )}
        </div>
      ))}
    </div>
  );
}
