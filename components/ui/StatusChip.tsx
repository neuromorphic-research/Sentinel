import type { EventStage } from "@/lib/types";
import { STAGE_META, TONE_CLASSES } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusChip({
  stage,
  className,
  pulse,
}: {
  stage: EventStage;
  className?: string;
  pulse?: boolean;
}) {
  const meta = STAGE_META[stage];
  const tone = TONE_CLASSES[meta.tone];
  const live = pulse ?? (stage === "candidate" || stage === "verifying");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
        tone.text,
        tone.ring,
        tone.bg,
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {live && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
              tone.dot
            )}
          />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", tone.dot)} />
      </span>
      {meta.label}
    </span>
  );
}
