"use client";

import type { LucideIcon } from "lucide-react";
import { RulePill } from "@/components/ui/RulePill";
import { cn } from "@/lib/utils";

export interface ChipGroupItem {
  value: string;
  label: string;
}

/**
 * A single "node" in the perception graph: a labelled input port with a row of
 * selectable chips wired beneath it. Toggling chips only mutates local state.
 */
export function ChipGroup({
  icon: Icon,
  label,
  hint,
  options,
  selected,
  onToggle,
  tone = "accent",
  last = false,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  options: ChipGroupItem[];
  selected: string[];
  onToggle: (value: string) => void;
  /** accent = standard selection, ignore = suppression list styling */
  tone?: "accent" | "ignore";
  /** drop the trailing connector wire on the last node */
  last?: boolean;
}) {
  return (
    <div className="relative pl-7">
      {/* Node port + connector wire */}
      <span
        className={cn(
          "absolute left-[7px] top-1 h-2.5 w-2.5 rounded-full border",
          selected.length > 0
            ? "border-accent bg-accent/30 shadow-glow"
            : "border-hairline-strong bg-elevated"
        )}
        aria-hidden
      />
      {!last && (
        <span
          className="absolute left-3 top-3.5 bottom-[-18px] w-px bg-hairline"
          aria-hidden
        />
      )}

      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-ink-faint" />
        <span className="overline">{label}</span>
        {hint && <span className="font-mono text-[10px] text-ink-faint">· {hint}</span>}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isOn = selected.includes(opt.value);
          const pillTone = isOn ? (tone === "ignore" ? "ignore" : "accent") : "neutral";
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              aria-pressed={isOn}
              className="rounded-md outline-none transition-transform duration-150 focus-visible:ring-1 focus-visible:ring-accent/50 active:scale-[0.97]"
            >
              <RulePill
                tone={pillTone}
                className={cn(
                  "cursor-pointer px-2.5 py-1 text-[11px] transition-colors",
                  !isOn && "hover:border-hairline-strong hover:text-ink"
                )}
              >
                {opt.label}
              </RulePill>
            </button>
          );
        })}
      </div>
    </div>
  );
}
