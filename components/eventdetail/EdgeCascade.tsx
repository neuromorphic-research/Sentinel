import { Activity, Brain, ShieldCheck, ArrowRight } from "lucide-react";
import { formatMs, cn } from "@/lib/utils";

/**
 * Cascade trace for *dismissed* events. Mirrors the shared CascadeTrace styling
 * but tells the suppression story accurately: Spike candidate → Talon dismiss →
 * Suppressed on-device. (CascadeTrace is hard-coded to the verified path, so the
 * dismissed "wow" moment gets its own honest readout.)
 */
export function EdgeCascade({
  spikeMs,
  talonMs,
  reasonLabel,
  className,
}: {
  spikeMs: number;
  talonMs: number;
  reasonLabel: string;
  className?: string;
}) {
  const steps = [
    {
      icon: Activity,
      block: "Spike",
      desc: "motion candidate",
      time: formatMs(spikeMs),
      tone: "text-accent",
    },
    {
      icon: Brain,
      block: "Talon",
      desc: `dismissed · ${reasonLabel.toLowerCase()}`,
      time: formatMs(talonMs),
      tone: "text-pending",
    },
    {
      icon: ShieldCheck,
      block: "Suppressed",
      desc: "no alert raised",
      time: "on-device",
      tone: "text-safe",
    },
  ];

  return (
    <div className={cn("flex items-stretch gap-2 text-xs", className)}>
      {steps.map((s, i) => (
        <div key={s.block} className="flex flex-1 items-center gap-2">
          <div className="flex-1 rounded-lg border border-hairline bg-elevated px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <s.icon className={cn("h-3.5 w-3.5", s.tone)} />
              <span className={cn("font-medium", s.tone)}>{s.block}</span>
            </div>
            <div className="mt-0.5 text-ink-soft">{s.desc}</div>
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
