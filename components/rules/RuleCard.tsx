"use client";

import { MapPin, Clock, ScanEye, Zap } from "lucide-react";
import type { Rule } from "@/lib/types";
import { ACTION_LABELS } from "@/lib/status";
import { RulePill } from "@/components/ui/RulePill";
import { cn } from "@/lib/utils";

export function RuleCard({
  rule,
  enabled,
  onToggle,
}: {
  rule: Rule;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "panel flex flex-col p-4 transition-colors",
        enabled ? "border-hairline-strong" : "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-medium text-ink">{rule.name}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{rule.text}</p>
        </div>
        <Toggle on={enabled} onClick={onToggle} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <RulePill tone="neutral">
          <MapPin className="h-3 w-3" />
          {rule.zone}
        </RulePill>
        <RulePill tone="neutral">
          <Clock className="h-3 w-3" />
          {rule.schedule}
        </RulePill>
        {rule.objects.map((o) => (
          <RulePill key={o} tone="accent">
            <ScanEye className="h-3 w-3" />
            {o}
          </RulePill>
        ))}
        {rule.ignore.map((i) => (
          <RulePill key={i} tone="ignore">
            {i}
          </RulePill>
        ))}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-hairline pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Zap className="h-3 w-3 text-ink-faint" />
          {rule.actions.length > 0 ? (
            rule.actions.map((a) => (
              <span key={a} className="font-mono text-[10px] text-ink-soft">
                {ACTION_LABELS[a]}
              </span>
            ))
          ) : (
            <span className="font-mono text-[10px] text-ink-faint">Log only</span>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="mono text-base font-medium text-ink">
            {rule.triggeredCount.toLocaleString("en-US")}
          </div>
          <div className="overline">triggered</div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full border transition-colors outline-none focus-visible:ring-1 focus-visible:ring-accent/50",
        on ? "border-accent/40 bg-accent/20" : "border-hairline-strong bg-elevated"
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-all duration-200",
          on ? "left-[18px] bg-accent shadow-glow" : "left-[3px] bg-ink-faint"
        )}
      />
    </button>
  );
}
