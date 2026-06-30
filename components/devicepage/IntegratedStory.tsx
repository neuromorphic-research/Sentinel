import { Radar, Brain, Megaphone, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stage {
  icon: LucideIcon;
  name: string;
  role: string;
  timing: string;
  tone: string;
}

const STAGES: Stage[] = [
  {
    icon: Radar,
    name: "Spike",
    role: "Always-on detector tracks people & vehicles",
    timing: "~38 ms",
    tone: "text-accent",
  },
  {
    icon: Brain,
    name: "Talon",
    role: "On-device VLM verifies the threat and writes the reason",
    timing: "~1.2 s",
    tone: "text-pending",
  },
  {
    icon: Megaphone,
    name: "Synapse",
    role: "Routes verified events to talk-down, lights or SOC",
    timing: "instant",
    tone: "text-safe",
  },
];

export function IntegratedStory({ className }: { className?: string }) {
  return (
    <div className={cn("panel p-5", className)}>
      <span className="overline">Integrated HW + SW</span>
      <h3 className="mt-2 max-w-2xl text-balance text-base font-semibold tracking-tight text-ink">
        The whole cascade runs on the Axon unit — no server, no round-trip.
      </h3>
      <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">
        Spike and Talon are co-designed for the Axon&apos;s 70-TOPS edge
        accelerator. Detection, verification and action all happen inside the
        camera, so latency is measured in milliseconds and the system keeps
        guarding even when the network is down.
      </p>

      <div className="mt-4 grid gap-px overflow-hidden rounded-lg bg-hairline md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {STAGES.map((s, i) => (
          <div key={s.name} className="contents">
            <div className="bg-panel-2 p-4">
              <div className="flex items-center justify-between">
                <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", s.tone)}>
                  <s.icon className="h-4 w-4" />
                  {s.name}
                </span>
                <span className="mono text-[10px] text-ink-faint">{s.timing}</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-soft">{s.role}</p>
            </div>
            {i < STAGES.length - 1 && (
              <div className="hidden items-center justify-center bg-panel-2 px-1 md:flex">
                <ChevronRight className="h-4 w-4 text-ink-faint" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-md border border-accent/20 bg-accent/5 px-3 py-2">
        <span className="mono text-[10px] uppercase tracking-[0.14em] text-accent">
          One unit
        </span>
        <span className="text-[11px] text-ink-soft">
          Hardware, detector and reasoning model ship and update together as a
          single verified perimeter guard.
        </span>
      </div>
    </div>
  );
}
